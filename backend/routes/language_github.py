from flask import Blueprint, jsonify, request
from models.language_github import LanguageGithub
from models import db
from models.language import Language

language_github_bp = Blueprint("language_github", __name__)

@language_github_bp.route("/language-github", methods=["GET"])
def get_language_github_urls():
    try:
        urls = LanguageGithub.query.all()
        return jsonify({
            "success": True,
            "data": [url.to_dict() for url in urls]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@language_github_bp.route("/language-github", methods=["POST"])
def add_language_github_url():
    try:
        data = request.get_json()
        language_id = data.get('language_id')
        github_url = data.get('github_url')

        if not language_id or not github_url:
            return jsonify({
                "success": False,
                "message": "Missing required fields"
            }), 400

        # Check if language exists
        language = Language.query.get(language_id)
        if not language:
            return jsonify({
                "success": False,
                "message": "Language not found"
            }), 404

        # Check if URL already exists for this language
        existing_url = LanguageGithub.query.filter_by(language_id=language_id).first()
        if existing_url:
            return jsonify({
                "success": False,
                "message": "GitHub URL already exists for this language"
            }), 400

        new_url = LanguageGithub(
            language_id=language_id,
            github_url=github_url
        )
        db.session.add(new_url)
        db.session.commit()

        return jsonify({
            "success": True,
            "data": new_url.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@language_github_bp.route("/language-github/<int:language_id>", methods=["PUT"])
def update_language_github_url(language_id):
    try:
        data = request.get_json()
        github_url = data.get('github_url')

        if not github_url:
            return jsonify({
                "success": False,
                "message": "GitHub URL is required"
            }), 400

        url_entry = LanguageGithub.query.filter_by(language_id=language_id).first()
        if not url_entry:
            return jsonify({
                "success": False,
                "message": "GitHub URL not found for this language"
            }), 404

        url_entry.github_url = github_url
        db.session.commit()

        return jsonify({
            "success": True,
            "data": url_entry.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500 