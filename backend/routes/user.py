from flask import Blueprint
from middleware import token_required
from utils import create_response

user_bp = Blueprint("user", __name__)

@user_bp.route("/", methods=["GET"])
@token_required
def get_user(user):
    return create_response(True, data=user.serialize(), status=200)
