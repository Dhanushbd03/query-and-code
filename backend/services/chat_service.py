from models import Conversation, Message


def getMessages(conversation_id, user):
    """Fetch a conversation and its message history for a user."""
    conversation = Conversation.query.filter_by(
        id=int(conversation_id), user_id=str(user.id)
    ).first()

    if not conversation:
        return "Conversation not found", None, 404

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

    return "", history, 200


def getConversations(user):
    """Fetch all conversations for a user with the first message as the title."""
    try:
        conversations = Conversation.query.filter_by(user_id=str(user.id)).all()

        response = []
        for conv in conversations:
            # Fetch the first message for the conversation
            first_message = (
                Message.query.filter_by(conversation_id=conv.id)
                .order_by(Message.timestamp.asc())
                .first()
            )
            print(first_message)
            title = first_message.message if first_message else "Untitled"

            # Serialize the conversation and add the title
            conv_data = conv.serialize_with_iso_dates()
            conv_data["title"] = title  # Add title field
            response.append(conv_data)

        return response, 200
    except Exception as e:
        return str(e), 500
