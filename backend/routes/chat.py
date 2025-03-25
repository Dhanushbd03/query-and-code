from flask import Blueprint, request
from models import db, Conversation, Message, Language
from utils import create_response
from services import ChatbotService, getMessages, getConversations
from middleware import token_required

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/start", methods=["POST"])  
@token_required
def start_conversation(user):
    """Start a new conversation"""
    data = request.json
    language_id = data.get("language_id")

    try:
        conversation = Conversation(user_id=user.id, language_id=language_id)
        db.session.add(conversation)
        db.session.commit()
        return create_response(True, conversation.serialize(), "Conversation started successfully", 201)
    except Exception as e:
        return create_response(False, message="Failed to start conversation"), 500


@chat_bp.route("/send", methods=["POST"])
@token_required
def send_message(user):
    """Send a message and get a chatbot response"""
    data = request.json
    conversation_id = data.get("conversation_id")
    message_text = data.get("message")
    language_id = data.get("language_id")

    if not conversation_id or not message_text or not language_id:
        return create_response(False, "", "Empty messages are not allowed", 400)

    # Get the language name from the Language table
    language = Language.query.filter_by(id=language_id).first()
    if not language:
        return create_response(False, "", "Invalid language", 400)

    collection_name = language.name  # Extract language name

    # Get conversation
    conversation = Conversation.query.filter_by(
        id=conversation_id, user_id=str(user.id), language_id=language_id
    ).first()
    if not conversation:
        return create_response(False, "", "Conversation not found", 404)

    try:
        # Initialize chatbot with dynamic collection name
        chatbot_service = ChatbotService(collection_name=collection_name)

        # Save user message
        user_message = Message(
            conversation_id=conversation.id, sender="user", message=message_text
        )
        db.session.add(user_message)

        # Generate chatbot response
        bot_response = chatbot_service.generate_response(user.id, message_text)
        bot_message = Message(
            conversation_id=conversation.id, sender="bot", message=bot_response
        )
        db.session.add(bot_message)
        db.session.commit()

        return create_response(True, bot_response, "Message received successfully", 201)
    except Exception as e:
        return create_response(False, None, "Something went wrong , please reload and check " + str(e), 500)


@chat_bp.route("/messages/<conversation_id>", methods=["GET"])
@token_required
def GetMessages(user, conversation_id):
    """Retrieve conversation history for a given conversation ID."""
    return getMessages(conversation_id, user)


@chat_bp.route("/<language_id>/conversations", methods=["GET"])
@token_required
def GetConversations(user, language_id):
    """Retrieve conversation history for a given conversation ID."""
    response, status_code = getConversations(user, language_id)

    if status_code != 200:
        return create_response(False, None, str(response), status_code)

    return create_response(True, response, "conversations fetched successfully", 200)

@chat_bp.route("/<conversation_id>", methods=["DELETE"])
@token_required
def delete_conversation(user, conversation_id):
    """Delete a conversation by ID."""
    try:
        conversation = Conversation.query.filter_by(id=conversation_id, user_id=user.id).first()
        if not conversation:
            return create_response(False, None, "Conversation not found", 404)
        
        conversation.soft_delete()
        return create_response(True, None, "Conversation deleted successfully", 200)
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return create_response(False, None, f"Failed to delete conversation: {str(e)}", 500)
