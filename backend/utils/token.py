# utils/token.py

import jwt
import datetime
import os
from utils import create_response
def generate_token(user_id):
    """Generate JWT token for authentication"""
    print(user_id)
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.now() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")

def verify_token(token):
    """Verify JWT token and return user ID"""
    try:
        payload = jwt.decode(token,  os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
