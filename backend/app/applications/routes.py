from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Application, Opportunity, User
from ..schemas import ApplicationSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..permissions import role_required
from ..notifications import notify_application_status_change

applications_bp = Blueprint('applications', __name__)
application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)

@applications_bp.route('/apply', methods=['POST'])
@jwt_required()
def apply():
    data = request.get_json() or {}
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user or not user.is_active:
        return jsonify({'msg':'user not found or inactive'}), 404
    opp_id = data.get('opportunity_id')
    if not opp_id:
        return jsonify({'msg':'opportunity_id required'}), 400
    opp = Opportunity.query.filter_by(id=opp_id, is_active=True).first()
    if not opp:
        return jsonify({'msg':'opportunity not found'}), 404
    existing = Application.query.filter_by(user_id=uid, opportunity_id=opp_id).first()
    if existing:
        return jsonify({'msg':'already applied','application':application_schema.dump(existing)}), 400
    apprec = Application(user_id=uid, opportunity_id=opp_id)
    db.session.add(apprec)
    db.session.commit()
    return application_schema.jsonify(apprec), 201

@applications_bp.route('/<int:app_id>/withdraw', methods=['POST'])
@jwt_required()
def withdraw(app_id):
    uid = get_jwt_identity()
    apprec = Application.query.get(app_id)
    if not apprec:
        return jsonify({'msg':'application not found'}), 404
    if apprec.user_id != uid:
        return jsonify({'msg':'forbidden'}), 403
    if apprec.status in ('withdrawn','accepted','rejected'):
        return jsonify({'msg':f'cannot withdraw application with status {apprec.status}'}), 400
    apprec.status = 'withdrawn'
    db.session.commit()
    try:
        opp = apprec.opportunity
        if opp and opp.organization and opp.organization.contact_email:
            notify_application_status_change(apprec.user.email, apprec.user.name, opp.title, apprec.status)
    except Exception:
        pass
    return application_schema.jsonify(apprec), 200

@applications_bp.route('/me', methods=['GET'])
@jwt_required()
def my_applications():
    uid = get_jwt_identity()
    apps = Application.query.filter_by(user_id=uid).order_by(Application.created_at.desc()).all()
    return applications_schema.jsonify(apps)

@applications_bp.route('/<int:app_id>/review', methods=['POST'])
@jwt_required()
@role_required('organization','admin')
def review_application(app_id):
    data = request.get_json() or {}
    action = data.get('action')
    if action not in ('accept','reject'):
        return jsonify({'msg':"action must be 'accept' or 'reject'"}), 400
    apprec = Application.query.get(app_id)
    if not apprec:
        return jsonify({'msg':'application not found'}), 404
    opp = apprec.opportunity
    if not opp:
        return jsonify({'msg':'opportunity not found'}), 404
    uid = get_jwt_identity()
    reviewer = User.query.get(uid)
    if reviewer.role != 'admin':
        org = opp.organization
        if not org:
            return jsonify({'msg':'opportunity has no organization'}), 400
        if not org.members.filter_by(id=uid).first() and org.owner_id != uid:
            return jsonify({'msg':'forbidden - not a member of the organization'}), 403
    apprec.status = 'accepted' if action == 'accept' else 'rejected'
    db.session.commit()
    try:
        notify_application_status_change(apprec.user.email, apprec.user.name, opp.title, apprec.status)
    except Exception:
        pass
    return application_schema.jsonify(apprec), 200
