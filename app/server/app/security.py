from typing import Any

from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt

from .extensions import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.check_password_hash(hashed, password)


def create_token_pair(identity: Any, additional_claims: dict[str, Any] | None = None) -> dict[str, str]:
    claims = additional_claims or {}
    access_token = create_access_token(identity=identity, additional_claims=claims)
    refresh_token = create_refresh_token(identity=identity, additional_claims=claims)
    return {"access_token": access_token, "refresh_token": refresh_token}


def current_role(default: str | None = None) -> str | None:
    jwt_data = get_jwt()
    return jwt_data.get("role", default)
