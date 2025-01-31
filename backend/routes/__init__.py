from flask import Blueprint, request, jsonify

main_bp = Blueprint('main', __name__)

from .auth import auth_bp
from .chat import chat_bp

main_bp.register_blueprint(auth_bp)
main_bp.register_blueprint(chat_bp)