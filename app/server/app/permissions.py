from functools import wraps
from typing import Callable, Optional

from flask import abort, request
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request

from .extensions import db
from .models import User, organization_members, Organization


def _get_current_user() -> Optional[User]:
    try:
        verify_jwt_in_request(optional=True)
    except Exception:
        return None
    identity = get_jwt_identity()
    if not identity:
        return None
    return db.session.get(User, identity)


def role_required(*roles: str) -> Callable:
    def decorator(fn: Callable) -> Callable:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if roles and claims.get("role") not in roles:
                abort(403, description="Forbidden")
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def org_or_admin_required(org_id_arg: str = "org_id") -> Callable:
    def decorator(fn: Callable) -> Callable:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = _get_current_user()
            if not user:
                abort(401, description="Missing auth")

            if user.is_admin():
                return fn(*args, **kwargs)

            org_id = kwargs.get(org_id_arg) or (request.json or {}).get(org_id_arg) or request.args.get(org_id_arg)
            if not org_id:
                abort(400, description="Organization id required")

            if not user.is_org_member(org_id):
                abort(403, description="Forbidden")
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def org_admin_or_site_admin_required(org_id_arg: str = "org_id") -> Callable:

    def decorator(fn: Callable) -> Callable:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = _get_current_user()
            if not user:
                abort(401, description="Missing auth")
            if user.is_admin():
                return fn(*args, **kwargs)

            org_id = kwargs.get(org_id_arg) or (request.json or {}).get(org_id_arg) or request.args.get(org_id_arg)
            if not org_id:
                abort(400, description="Organization id required")
            org = db.session.get(Organization, org_id)
            if not org:
                abort(404, description="Organization not found")
            if org.owner_id == user.id:
                return fn(*args, **kwargs)
            if user.is_org_member(org_id):
                return fn(*args, **kwargs)
            abort(403, description="Forbidden")
            return fn(*args, **kwargs)

        return wrapper

    return decorator

admin_required = role_required("admin")
organization_required = role_required("organization", "admin")
volunteer_required = role_required("volunteer", "admin", "organization")
