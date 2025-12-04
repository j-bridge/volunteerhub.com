from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    jwt_required,
    decode_token,
    create_access_token,
)
from sqlalchemy import select
from datetime import timedelta
import jwt

from ..extensions import db
from ..models import User, Organization
from marshmallow import ValidationError
from ..schemas import (
    UserSchema,
    RegisterSchema,
    LoginSchema,
    ChangeRoleSchema,
    PasswordResetRequestSchema,
    PasswordResetSchema,
)
from ..security import create_token_pair, hash_password, verify_password, password_validation_error
from ..permissions import role_required
from ..utils.emailer import send_email, send_templated_email

bp = Blueprint("auth", __name__)
user_schema = UserSchema()
register_schema = RegisterSchema()
login_schema = LoginSchema()
change_role_schema = ChangeRoleSchema()
reset_request_schema = PasswordResetRequestSchema()
reset_schema = PasswordResetSchema()


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

    user_role = data.get("role") or "volunteer"
    org_name = data.get("organization_name")

    user = User(
        email=email,
        password_hash=hash_password(password),
        role=user_role,
        name=data.get("name"),
    )
    db.session.add(user)
    db.session.flush()

    if user_role == "organization":
        if not org_name:
            return jsonify({"error": "organization_name is required for organization accounts"}), 400
        org = Organization(
            name=org_name,
            contact_email=email,
            owner_id=user.id,
        )
        db.session.add(org)

    db.session.commit()

    try:
        send_templated_email(
            subject="Welcome to VolunteerHub",
            recipients=email,
            template_name="welcome_email.html",
            context={"user_name": user.name},
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


@bp.post("/forgot")
def forgot_password():
    try:
        data = reset_request_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    email = data["email"].strip().lower()
    user = db.session.execute(select(User).filter_by(email=email)).scalar_one_or_none()

    # Always return success to avoid leaking which emails exist
    if not user:
        return jsonify({"message": "If that account exists, a reset link has been sent."}), 200

    token = create_access_token(
        identity=user.id,
        additional_claims={"role": user.role, "reset": True},
        expires_delta=timedelta(hours=1),
    )

    frontend = current_app.config.get("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    reset_url = f"{frontend}/reset?token={token}"

    send_templated_email(
        subject="Reset your VolunteerHub password",
        recipients=email,
        template_name="password_reset_email.html",
        context={
            "user_name": user.name or user.email,
            "user_email": user.email,
            "reset_url": reset_url,
            "preheader": "Use this link to set a new password.",
        },
    )

    return jsonify({"message": "If that account exists, a reset link has been sent."}), 200


@bp.post("/reset")
def reset_password():
    try:
        data = reset_schema.load(request.get_json(silent=True) or {})
    except ValidationError as err:
        return jsonify({"error": "Validation error", "details": err.messages}), 400

    new_password = data["password"]
    pwd_err = password_validation_error(new_password)
    if pwd_err:
        return jsonify({"error": pwd_err}), 400

    token_str = data["token"]
    try:
        decoded = decode_token(token_str)
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Reset link has expired"}), 400
    except Exception:
        return jsonify({"error": "Invalid reset token"}), 400

    if not decoded or not decoded.get("claims", {}).get("reset"):
        return jsonify({"error": "Invalid reset token"}), 400

    user_id = decoded.get("sub")
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Invalid reset token"}), 400

    user.password_hash = hash_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password updated successfully"}), 200
