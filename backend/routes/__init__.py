from flask import Blueprint

main_bp = Blueprint("main", __name__)

from .auth import auth_bp
from .chat import chat_bp
from .user import user_bp
from .indexing_route import indexing_bp
from .language_routes import language_bp

main_bp.register_blueprint(auth_bp, url_prefix="/auth")
main_bp.register_blueprint(chat_bp, url_prefix="/chat")
main_bp.register_blueprint(user_bp, url_prefix="/user")
main_bp.register_blueprint(indexing_bp, url_prefix="/index")
main_bp.register_blueprint(language_bp, url_prefix="/languages")
