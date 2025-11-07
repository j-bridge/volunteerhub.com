from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import User
from ..schemas import UserSchema
from ..security import hash_password, verify_password
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required

auth_bp = Blueprint('auth', __name__)
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'volunteer')
    if not email or not password:
        return jsonify({'msg':'email and password required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'msg':'email already registered'}), 400
    user = User(email=email, password_hash=hash_password(password), name=name, role=role)
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'msg':'email and password required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({'msg':'invalid credentials'}), 401
    access = create_access_token(identity=user.id, additional_claims={'role': user.role})
    refresh = create_refresh_token(identity=user.id)
    return jsonify({'access_token':access,'refresh_token':refresh,'user':user_schema.dump(user)}), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    from flask_jwt_extended import get_jwt_identity, create_access_token
    uid = get_jwt_identity()
    user = User.query.get(uid)
    access = create_access_token(identity=user.id, additional_claims={'role': user.role})
    return jsonify({'access_token': access}), 200
