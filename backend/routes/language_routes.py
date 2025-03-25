from flask import Blueprint, request
from utils import create_response
from services import get_all_languages, create_language, update_language, delete_language
from models import db, Language

language_bp = Blueprint("languages", __name__)


@language_bp.route("/", methods=["GET"])
def get_languages():
    response, status_code = get_all_languages()

    if status_code != 200:
        return create_response(False, message=str(response)), status_code

    return create_response(True, response, "Languages fetched successfully", 200), 200

@language_bp.route("/", methods=["POST"])
def add_language():
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        github_url = data.get('github_url')

        if not name:
            return create_response(False, message="Name is required"), 400

        language = Language(name=name)
        language.description = description
        language.github_url = github_url

        db.session.add(language)
        db.session.commit()

        return create_response(True, language.to_dict(), "Language added successfully", 201)
    except Exception as e:
        db.session.rollback()
        return create_response(False, message=str(e)), 500

@language_bp.route("/<language_id>", methods=["PUT"])
def update_language_route(language_id):
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        github_url = data.get('github_url')

        language = Language.query.get(language_id)
        if not language:
            return create_response(False, message="Language not found"), 404

        if name:
            language.name = name
        if description is not None:
            language.description = description
        if github_url is not None:
            language.github_url = github_url

        db.session.commit()

        return create_response(True, language.to_dict(), "Language updated successfully", 200)
    except Exception as e:
        db.session.rollback()
        return create_response(False, message=str(e)), 500

@language_bp.route("/<language_id>", methods=["DELETE"])
def delete_language_route(language_id):
    try:
        language = Language.query.get(language_id)
        if not language:
            return create_response(False, message="Language not found"), 404

        db.session.delete(language)
        db.session.commit()

        return create_response(True, None, "Language deleted successfully", 200)
    except Exception as e:
        db.session.rollback()
        return create_response(False, message=str(e)), 500
