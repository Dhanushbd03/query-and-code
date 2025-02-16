from models import User , db
from utils import generate_token , create_response , verify_token
from werkzeug.security import generate_password_hash , check_password_hash
import random
import traceback

def register_user(name, email, password):
    """Register a new user and set JWT token in an HTTP-only cookie."""
    try:
        username = name + str(random.randint(1000, 9999))
        # Check if email is already registered
        if User.query.filter_by(email=email).first():
            return create_response(False, message="Email already registered", status=400)

        # Hash password and create user
        hashed_password = generate_password_hash(password)
        user = User(name=name,username=username , email=email, password_hash=hashed_password)

        # Save to DB
        db.session.add(user)


        # Generate JWT Token
        try:
            token = generate_token(user.id)
        except Exception as e:
            traceback.print_exc()
            return create_response(False, message="Token generation failed", status=500)
        
        # if no error, commit to DB
        db.session.commit()

        # Create response with token as an HTTP-only cookie
        response = create_response(True, data={"name": user.username, "email": user.email}, status=201)
        response.set_cookie("token", token, httponly=True, secure=True, samesite="Strict")
        return response

    except Exception as e:
        traceback.print_exc()  # ✅ Print full error traceback for debugging
        return create_response(False, message="Internal Server Error", status=500)

def login_user(identifier, password):
    """Handles user login logic."""
    try:
        if not identifier or not password:
            return create_response(False, message="No input data provided", status=400)

        # Check if user exists by email or username
        user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
        if not user:
            return create_response(False, message="Invalid credentials", status=401)

        # Verify password
        if not check_password_hash(user.password_hash, password):
            return create_response(False, message="Invalid credentials", status=401)

        # Generate JWT Token
        try:
            token = generate_token(user.id)
        except Exception as e:
            return create_response(False, message="Token generation failed", status=500)

        # Create response with token as an HTTP-only cookie
        response = create_response(True, data={"name": user.username, "email": user.email}, status=200)
        response.set_cookie("token", token, httponly=True, secure=True, samesite="Strict")
        return response

    except Exception as e:
        traceback.print_exc()  # ✅ Debugging if any unexpected error occurs
        return create_response(False, message="Internal Server Error", status=500)

def logout_user():
    """Logs out user by clearing token cookie."""
    try:
        response = create_response(True, message="Logged out successfully", status=200)
        response.set_cookie("token", "", expires=0, httponly=True, secure=True, samesite="Strict")
        return response
    except Exception as e:
        return create_response(False, message="Logout failed", status=500)