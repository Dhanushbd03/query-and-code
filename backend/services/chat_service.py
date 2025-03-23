from models import Conversation, Message
from utils import create_response


def getMessages(conversation_id, user):
    """Fetch a conversation and its message history for a user."""
    conversation = Conversation.query.filter_by(
        id=conversation_id, 
        user_id=user.id,
        deleted_at=None  # Only get non-deleted conversations
    ).first()

    if not conversation:
        return create_response(False, None, "Conversation not found", 404)

    messages = (
        Message.query.filter_by(conversation_id=conversation.id)
        .order_by(Message.timestamp.asc())
        .all()
    )

    history = [
        {
            "id": msg.id,
            "conversation_id": conversation.id,
            "sender": msg.sender,
            "message": msg.message,
            "timestamp": msg.timestamp,
        }
        for msg in messages
    ]

    return create_response(True, history, "Messages retrieved successfully", 200)


def getConversations(user, language_id):
    """Fetch all non-deleted conversations for a user with the first message as the title."""
    try:
        conversations = Conversation.query.filter_by(
            user_id=str(user.id), 
            language_id=str(language_id),
            deleted_at=None  # Only get non-deleted conversations
        ).all()

        response = []
        for conv in conversations:
            # Fetch the first message for the conversation
            first_message = (
                Message.query.filter_by(conversation_id=conv.id)
                .order_by(Message.timestamp.asc())
                .first()
            )
            title = first_message.message if first_message else "Untitled"

            # Serialize the conversation and add the title
            conv_data = conv.serialize_with_iso_dates()
            conv_data["title"] = title  # Add title field
            response.append(conv_data)

        return create_response(True, response, "Conversations retrieved successfully", 200)
    except Exception as e:
        return create_response(False, None, f"Failed to get conversations: {str(e)}", 500)
