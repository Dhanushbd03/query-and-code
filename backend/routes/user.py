from flask import Blueprint
from middleware import token_required
from utils import create_response
from services import GetAllUsersService
user_bp = Blueprint("user", __name__)

@user_bp.route("/", methods=["GET"])
@token_required
def get_user(user):
    return create_response(True, data=user.serialize(), status=200)


@user_bp.route("/all", methods=["GET"])
def getAllUsers(user):
    users = GetAllUsersService()
    return create_response(True, data=users, status=200)