# routes/chat.py

from flask import Blueprint, request, jsonify
from models import db, Conversation, Message
from utils import verify_token

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/start', methods=['POST'])
def start_conversation():
    """Start a new conversation"""
    token = request.headers.get('Authorization')

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    conversation = Conversation(user_id=user_id)
    db.session.add(conversation)
    db.session.commit()

    return jsonify({"conversation_id": conversation.id}), 201

@chat_bp.route('/send', methods=['POST'])
def send_message():
    """Send a message in a conversation"""
    token = request.headers.get('Authorization')
    user_id = verify_token(token)
    
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.json
    conversation_id = data.get('conversation_id')
    message_text = data.get('message')

    message = Message(conversation_id=conversation_id, sender="user", message=message_text)
    db.session.add(message)
    db.session.commit()

    return jsonify({"message": "Message sent"}), 201
