from flask import Blueprint
from utils import create_response
from services import get_all_languages

language_bp = Blueprint("languages", __name__)


@language_bp.route("/", methods=["GET"])
def getLanguages():
    response, status_code = get_all_languages()

    if status_code != 200:
        return create_response(False, message=str(response)), status_code

    return create_response(True, response, "Languages fetched successfully", 200), 200
