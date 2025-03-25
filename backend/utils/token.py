import jwt
import datetime
import os
import uuid  # Ensure UUID module is imported

def generate_token(user_id):    
    user_id_str = str(user_id)
    payload = {
        "user_id": user_id_str,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

def verify_token(token):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = uuid.UUID(payload["user_id"])  
        return user_id
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
