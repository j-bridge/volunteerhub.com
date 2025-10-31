from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import select

from ..extensions import db
from ..models import User
from ..schemas import UserSchema
from ..security import create_token_pair, hash_password, verify_password

bp = Blueprint("auth", __name__)
user_schema = UserSchema()


@bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password")
    role = (payload.get("role") or "volunteer").strip().lower()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing = db.session.execute(select(User).filter_by(email=email)).scalar_one_or_none()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    user = User(email=email, password_hash=hash_password(password), role=role)
    db.session.add(user)
    db.session.commit()

    tokens = create_token_pair(identity=user.id, additional_claims={"role": user.role})
    return jsonify({"user": user_schema.dump(user), "tokens": tokens}), 201


@bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password")

    if not email or not password:
        return jsonify({"error": "Invalid credentials"}), 400

    user = db.session.execute(select(User).filter_by(email=email)).scalar_one_or_none()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401

    tokens = create_token_pair(identity=user.id, additional_claims={"role": user.role})
    return jsonify({"user": user_schema.dump(user), "tokens": tokens})


@bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()
    tokens = create_token_pair(identity=identity, additional_claims={"role": claims.get("role")})
    return jsonify(tokens)
