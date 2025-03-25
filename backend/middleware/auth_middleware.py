from flask import request, jsonify
from functools import wraps
from models import User, Admin
from utils import verify_token, create_response
import jwt
from utils.config import SECRET_KEY

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("token") 
        if not token:
            return create_response(False, message="Token is missing"), 401

        try:
            user_id = verify_token(token)
            user = User.query.get(user_id)
            if not user:
                return create_response(False, message="User not found"), 404
        except Exception as e:
            print(e)
            return create_response(False, message="Something went wrong"), 500

        return f(user, *args, **kwargs)  # Pass user object to route
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('admin_token')
        if not token:
            return create_response(False, None, "Admin token is missing", 401)
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_admin = Admin.query.get(data['admin_id'])
            if not current_admin:
                return create_response(False, None, "Admin not found", 401)
        except jwt.ExpiredSignatureError:
            return create_response(False, None, "Admin token has expired", 401)
        except jwt.InvalidTokenError:
            return create_response(False, None, "Admin token is invalid", 401)
        except Exception as e:
            return create_response(False, None, "Admin authentication error", 401)
        return f(current_admin, *args, **kwargs)
    return decorated
