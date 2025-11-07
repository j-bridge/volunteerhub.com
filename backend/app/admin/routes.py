from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import User, Organization
from ..schemas import UserSchema, OrgSchema
from ..permissions import role_required

admin_bp = Blueprint('admin', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
org_schema = OrgSchema()
orgs_schema = OrgSchema(many=True)

@admin_bp.route('/users', methods=['GET'])
@role_required('admin')
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return users_schema.jsonify(users)

@admin_bp.route('/users/<int:user_id>/role', methods=['POST'])
@role_required('admin')
def change_role(user_id):
    data = request.get_json() or {}
    new_role = data.get('role')
    if new_role not in ('volunteer','organization','admin'):
        return jsonify({'msg':'invalid role'}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg':'user not found'}), 404
    user.role = new_role
    db.session.commit()
    return user_schema.jsonify(user)

@admin_bp.route('/users/<int:user_id>/delete', methods=['POST'])
@role_required('admin')
def soft_delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg':'user not found'}), 404
    user.is_active = False
    db.session.commit()
    return jsonify({'msg':'user soft-deleted'}), 200

@admin_bp.route('/orgs', methods=['GET'])
@role_required('admin')
def list_orgs_admin():
    orgs = Organization.query.order_by(Organization.created_at.desc()).all()
    return orgs_schema.jsonify(orgs)

@admin_bp.route('/orgs/<int:org_id>/delete', methods=['POST'])
@role_required('admin')
def soft_delete_org(org_id):
    org = Organization.query.get(org_id)
    if not org:
        return jsonify({'msg':'org not found'}), 404
    org.is_active = False
    for opp in org.opportunities:
        opp.is_active = False
    db.session.commit()
    return jsonify({'msg':'organization soft-deleted'}), 200
