from flask import Blueprint, request
from middleware import token_required
from utils import create_response
from models import User, db
from services.user_service import GetAllUsersService
from routes.admin import admin_required

user_bp = Blueprint("user", __name__)

@user_bp.route("/", methods=["GET"])
@token_required
def get_user(user):
    return create_response(True, user.serialize(), "User retrieved successfully", 200)
