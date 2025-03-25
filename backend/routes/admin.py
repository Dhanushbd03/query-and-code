from flask import Blueprint, request, jsonify, make_response
from models.admin import Admin
from models import db
import jwt
from datetime import datetime, timedelta
from utils.config import SECRET_KEY
from utils import create_response
from services import GetAllUsersService
from middleware import admin_required

admin_bp = Blueprint('admin', __name__)

if not SECRET_KEY:
    raise ValueError("❌ SECRET_KEY is not set in the environment variables!")

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return create_response(False, None, "Missing email or password", 400)
    
    admin = Admin.query.filter_by(email=data['email']).first()
    
    if not admin or not admin.check_password(data['password']):
        return create_response(False, None, "Invalid email or password", 401)
    
    # Generate JWT token
    token = jwt.encode({
        'admin_id': str(admin.id),
        'exp': datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    
    admin_data = {
        'id': str(admin.id),
        'username': admin.username,
        'email': admin.email
    }
    
    response = create_response(True, admin_data, "Login successful", 200)
    
    response.set_cookie(
        'admin_token',
        token,
        httponly=True,  
        secure=True,    
        samesite='Lax', 
        max_age=86400   
    )
    
    return response

@admin_bp.route('/logout', methods=['POST'])
def admin_logout():
    response = make_response(create_response(True, None, "Logged out successfully", 200))
    response.delete_cookie('admin_token')
    return response

@admin_bp.route('/profile', methods=['GET'])
@admin_required
def get_admin_profile(current_admin):
    admin_data = {
        'id': str(current_admin.id),
        'username': current_admin.username,
        'email': current_admin.email,
        'created_at': current_admin.created_at.isoformat()
    }
    return create_response(True, admin_data, "Admin profile retrieved successfully", 200)

@admin_bp.route("/users", methods=["GET"])
@admin_required
def getAllUsers(current_admin):
    users = GetAllUsersService()
    return create_response(True, users, "Users retrieved successfully", 200)