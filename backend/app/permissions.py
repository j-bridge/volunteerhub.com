from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify

def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get('role')
            if role not in allowed_roles:
                return jsonify({'msg':'Forbidden - insufficient role'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
