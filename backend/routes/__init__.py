from flask import Blueprint

main_bp = Blueprint('main', __name__)

from .auth import auth_bp
from .chat import chat_bp
from .user import user_bp


main_bp.register_blueprint(auth_bp, url_prefix='/auth')
main_bp.register_blueprint(chat_bp, url_prefix='/chat')
main_bp.register_blueprint(user_bp, url_prefix='/user')