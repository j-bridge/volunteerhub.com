from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User
from ..schemas import UserSchema

users_bp = Blueprint('users', __name__)
user_schema = UserSchema()

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({'msg':'not found'}), 404
    return user_schema.jsonify(user)
