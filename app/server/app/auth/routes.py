from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy import select

from ..extensions import db
from ..models import User
from marshmallow import ValidationError
from ..schemas import UserSchema, RegisterSchema, LoginSchema, ChangeRoleSchema
from ..security import create_token_pair, hash_password, verify_password, password_validation_error
from ..permissions import role_required
from ..utils.emailer import send_email

bp = Blueprint("auth", __name__)
user_schema = UserSchema()
register_schema = RegisterSchema()
login_schema = LoginSchema()
change_role_schema = ChangeRoleSchema()


@bp.post("/register")
def register():
    try:
        data = register_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    email = data["email"].strip().lower()
    password = data["password"]

    pwd_err = password_validation_error(password)
    if pwd_err:
        return jsonify({"error": pwd_err}), 400

    existing = db.session.execute(select(User).filter_by(email=email)).scalar_one_or_none()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        email=email,
        password_hash=hash_password(password),
        role=data.get("role") or "volunteer",
        name=data.get("name"),
    )
    db.session.add(user)
    db.session.commit()

    try:
        frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:5173")
        send_email(
            subject="Welcome to VolunteerHub",
            recipients=email,
            text_body=f"Hi {user.name or 'there'},\n\nThanks for joining VolunteerHub! You can sign in at {frontend_url}.\n\n- VolunteerHub",
            html_body=f"<p>Hi {user.name or 'there'},</p><p>Thanks for joining VolunteerHub! You can <a href='{frontend_url}'>sign in here</a>.</p><p>- VolunteerHub</p>",
        )
    except Exception:
        current_app.logger.exception("Failed to send welcome email to %s", email)

    tokens = create_token_pair(identity=user.id, additional_claims={"role": user.role})
    return jsonify({"user": user_schema.dump(user), "tokens": tokens}), 201


@bp.post("/login")
def login():
    try:
        payload = login_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    email = payload["email"].strip().lower()
    password = payload["password"]

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


@bp.post("/users/<int:user_id>/role")
@jwt_required()
@role_required("admin")
def change_role(user_id: int):
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
