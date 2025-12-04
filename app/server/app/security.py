from typing import Any
import re

from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt

from .extensions import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.check_password_hash(hashed, password)


def password_validation_error(password: str) -> str | None:
    if not password or len(password) < 8:
        return "password must be at least 8 characters"
    if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        return "password must include at least one letter and one number"
    return None


def create_token_pair(identity: Any, additional_claims: dict[str, Any] | None = None) -> dict[str, str]:
    claims = additional_claims or {}
    # PyJWT requires the `sub` claim to be a string; keep the numeric user id but cast to str in the token.
    str_identity = str(identity)
    access_token = create_access_token(identity=str_identity, additional_claims=claims)
    refresh_token = create_refresh_token(identity=str_identity, additional_claims=claims)
    return {"access_token": access_token, "refresh_token": refresh_token}


def current_role(default: str | None = None) -> str | None:
    jwt_data = get_jwt()
    return jwt_data.get("role", default)
