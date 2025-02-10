
from flask import Blueprint, request, jsonify
from services import register_user , login_user , logout_user


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """User Registration (Uses Auth Service)"""
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    return register_user(username, email, password)


@auth_bp.route('/login', methods=['POST'])
def login():
    """User Login (Calls Auth Service)"""
    data = request.json
    identifier = data.get('identifier')
    password = data.get('password')

    return login_user(identifier, password)


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User Logout"""
    return logout_user()

    