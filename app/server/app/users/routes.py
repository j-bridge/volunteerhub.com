from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import select

from ..extensions import db
from ..models import User
from ..schemas import UserSchema, ChangeRoleSchema, UserUpdateSchema
from ..permissions import role_required
from marshmallow import ValidationError

bp = Blueprint("users", __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
change_role_schema = ChangeRoleSchema()
user_update_schema = UserUpdateSchema()

def _current_user_id() -> int | None:
    try:
        return int(get_jwt_identity())
    except (TypeError, ValueError):
        return None


@bp.get("/")
@jwt_required()
@role_required("admin")
def list_users():
    query = select(User).order_by(User.created_at.desc())
    users = db.session.execute(query).scalars().all()
    return jsonify({"users": users_schema.dump(users)})


@bp.get("/me")
@jwt_required()
def retrieve_current_user():
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user_schema.dump(user)})


@bp.patch("/me")
@jwt_required()
def update_current_user():
    user_id = _current_user_id()
    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        payload = user_update_schema.load(request.get_json(silent=True) or {}, partial=True)
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    if "name" in payload:
        user.name = payload.get("name")

    if "email" in payload and payload.get("email") != user.email:
        existing = User.query.filter_by(email=payload["email"]).first()
        if existing and existing.id != user.id:
            return jsonify({"error": "Email already in use"}), 409
        user.email = payload["email"]

    if payload.get("role") and get_jwt().get("role") == "admin":
        user.role = payload["role"]

    db.session.commit()
    return jsonify({"user": user_schema.dump(user)})


@bp.post("/<int:user_id>/role")
@jwt_required()
@role_required("admin")
def change_user_role(user_id: int):
    try:
        data = change_role_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.role = data["role"]
    db.session.commit()
    return jsonify({"user": user_schema.dump(user)})


@bp.get("/<int:user_id>")
@jwt_required()
def retrieve_user(user_id: int):
    current_id = _current_user_id()
    if current_id is None:
        return jsonify({"error": "Unauthorized"}), 401
    claims = get_jwt()
    if current_id != user_id and claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user_schema.dump(user)})


@bp.patch("/<int:user_id>")
@jwt_required()
@role_required("admin")
def admin_update_user(user_id: int):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        payload = user_update_schema.load(request.get_json(silent=True) or {}, partial=True)
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    if "name" in payload:
        user.name = payload.get("name")
    if "email" in payload and payload.get("email") != user.email:
        existing = User.query.filter_by(email=payload["email"]).first()
        if existing and existing.id != user.id:
            return jsonify({"error": "Email already in use"}), 409
        user.email = payload["email"]
    if payload.get("role"):
        user.role = payload["role"]

    db.session.commit()
    return jsonify({"user": user_schema.dump(user)})
