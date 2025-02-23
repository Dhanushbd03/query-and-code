from flask import request, jsonify
from functools import wraps
from models import User
from utils import verify_token , create_response

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
