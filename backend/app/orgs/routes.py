from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Organization, User, organization_members
from ..schemas import OrgSchema, UserSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..permissions import role_required

orgs_bp = Blueprint('orgs', __name__)
org_schema = OrgSchema()
orgs_schema = OrgSchema(many=True)
user_schema = UserSchema()

@orgs_bp.route('/', methods=['POST'])
@jwt_required()
@role_required('organization','admin')
def create_org():
    data = request.get_json() or {}
    uid = get_jwt_identity()
    org = Organization.query.filter_by(owner_id=uid).first()
    if org:
        org.name = data.get('name', org.name)
        org.contact_email = data.get('contact_email', org.contact_email)
        org.description = data.get('description', org.description)
    else:
        if not data.get('name'):
            return jsonify({'msg':'name required'}), 400
        org = Organization(name=data.get('name'), contact_email=data.get('contact_email'), description=data.get('description'), owner_id=uid)
        db.session.add(org)
    db.session.commit()
    if not org.members.filter_by(id=uid).first():
        org.members.append(User.query.get(uid))
        db.session.commit()
    db.session.execute(organization_members.update().where(organization_members.c.user_id == uid).where(organization_members.c.organization_id == org.id).values(role='owner'))
    db.session.commit()
    return org_schema.jsonify(org), 201

@orgs_bp.route('/<int:org_id>', methods=['GET'])
def get_org(org_id):
    org = Organization.query.filter_by(id=org_id, is_active=True).first()
    if not org:
        return jsonify({'msg':'organization not found'}), 404
    return org_schema.jsonify(org)

@orgs_bp.route('/<int:org_id>/members', methods=['POST'])
@jwt_required()
def add_member(org_id):
    data = request.get_json() or {}
    target_user_id = data.get('user_id')
    role = data.get('role', 'member')
    uid = get_jwt_identity()
    org = Organization.query.get(org_id)
    if not org or not org.is_active:
        return jsonify({'msg':'organization not found'}), 404
    if uid != org.owner_id:
        return jsonify({'msg':'forbidden'}), 403
    user = User.query.get(target_user_id)
    if not user or not user.is_active:
        return jsonify({'msg':'target user not found'}), 404
    if org.members.filter_by(id=target_user_id).first():
        return jsonify({'msg':'user already a member'}), 400
    org.members.append(user)
    db.session.commit()
    db.session.execute(organization_members.update().where(organization_members.c.user_id == target_user_id).where(organization_members.c.organization_id == org_id).values(role=role))
    db.session.commit()
    return jsonify({'msg':'member added','user':user_schema.dump(user)}), 201

@orgs_bp.route('/<int:org_id>/members/<int:user_id>', methods=['DELETE'])
@jwt_required()
def remove_member(org_id, user_id):
    uid = get_jwt_identity()
    org = Organization.query.get(org_id)
    if not org:
        return jsonify({'msg':'organization not found'}), 404
    if uid != org.owner_id:
        return jsonify({'msg':'forbidden - only owner can remove members'}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg':'user not found'}), 404
    if not org.members.filter_by(id=user_id).first():
        return jsonify({'msg':'user is not a member'}), 400
    org.members.remove(user)
    db.session.commit()
    return jsonify({'msg':'member removed'}), 200

@orgs_bp.route('/', methods=['GET'])
def list_orgs():
    q = Organization.query.filter_by(is_active=True).order_by(Organization.created_at.desc())
    return orgs_schema.jsonify(q.all())
