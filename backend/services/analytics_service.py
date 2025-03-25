from models import db, Message, Conversation, Language, User
from sqlalchemy import func, text
from datetime import datetime, timedelta
from utils import create_response

def get_hourly_chat_activity():
    """Get chat activity grouped by hour for the last 24 hours"""
    query = text("""
        WITH RECURSIVE hours AS (
            SELECT date_trunc('hour', NOW()) AS hour
            UNION ALL
            SELECT hour - interval '1 hour'
            FROM hours
            WHERE hour > NOW() - interval '24 hours'
        )
        SELECT 
            hours.hour,
            COUNT(m.id) as message_count
        FROM hours
        LEFT JOIN message m ON date_trunc('hour', m.timestamp) = hours.hour
            AND m.deleted_at IS NULL
        GROUP BY hours.hour
        ORDER BY hours.hour;
    """)
    
    result = db.session.execute(query)
    activity = []
    for row in result:
        activity.append({
            'hour': row.hour.isoformat(),
            'message_count': row.message_count
        })
    return activity

def get_weekly_chat_activity():
    """Get chat activity grouped by day for the last 7 days"""
    query = text("""
        WITH RECURSIVE days AS (
            SELECT date_trunc('day', NOW()) AS day
            UNION ALL
            SELECT day - interval '1 day'
            FROM days
            WHERE day > NOW() - interval '7 days'
        )
        SELECT 
            days.day,
            COUNT(m.id) as message_count
        FROM days
        LEFT JOIN message m ON date_trunc('day', m.timestamp) = days.day
            AND m.deleted_at IS NULL
        GROUP BY days.day
        ORDER BY days.day;
    """)
    
    result = db.session.execute(query)
    activity = []
    for row in result:
        activity.append({
            'day': row.day.isoformat(),
            'message_count': row.message_count
        })
    return activity

def get_language_distribution():
    """Get chat distribution by programming language"""
    query = text("""
        SELECT 
            l.name as language,
            COUNT(DISTINCT c.id) as conversation_count,
            COUNT(m.id) as message_count
        FROM languages l
        LEFT JOIN conversation c ON l.id = c.language_id AND c.deleted_at IS NULL
        LEFT JOIN message m ON c.id = m.conversation_id AND m.deleted_at IS NULL
        GROUP BY l.id, l.name
        ORDER BY conversation_count DESC;
    """)
    
    result = db.session.execute(query)
    distribution = []
    for row in result:
        distribution.append({
            'language': row.language,
            'conversation_count': row.conversation_count,
            'message_count': row.message_count
        })
    return distribution

def get_quick_stats():
    """Get quick statistics about the chat system"""
    # Today's stats
    today = datetime.now().date()
    today_start = datetime.combine(today, datetime.min.time())
    
    # Total chats today
    total_chats_today = Conversation.query.filter(
        func.date(Conversation.created_at) == today,
        Conversation.deleted_at.is_(None)
    ).count()
    
    # Active users today
    active_users_today = db.session.query(func.count(func.distinct(Conversation.user_id))).filter(
        func.date(Conversation.created_at) == today,
        Conversation.deleted_at.is_(None)
    ).scalar()
    
    # Average response time calculation
    query = text("""
        WITH message_pairs AS (
            SELECT 
                c.id as conversation_id,
                m1.timestamp as user_timestamp,
                MIN(m2.timestamp) as bot_timestamp
            FROM conversation c
            JOIN message m1 ON c.id = m1.conversation_id AND m1.sender = 'user'
            JOIN message m2 ON c.id = m2.conversation_id 
                AND m2.sender = 'bot'
                AND m2.timestamp > m1.timestamp
            WHERE c.deleted_at IS NULL
            AND m1.deleted_at IS NULL
            AND m2.deleted_at IS NULL
            GROUP BY c.id, m1.id, m1.timestamp
        )
        SELECT 
            AVG(EXTRACT(EPOCH FROM (bot_timestamp - user_timestamp))) as avg_response_time
        FROM message_pairs;
    """)
    
    result = db.session.execute(query)
    avg_response_time = result.fetchone().avg_response_time or 0
    
    # Total users
    total_users = User.query.count()
    
    return {
        'total_chats_today': total_chats_today,
        'active_users_today': active_users_today,
        'avg_response_time': round(avg_response_time, 2),  # in seconds
        'total_users': total_users
    }

def get_user_stats(user_id):
    """Get statistics for a specific user."""
    user = User.query.get(user_id)
    if not user:
        return create_response(False, None, "User not found", 404)

    try:
        # Get conversation count
        conversation_count = Conversation.query.filter_by(
            user_id=user_id,
            deleted_at=None
        ).count()

        # Get message count
        message_count = (
            Message.query.join(Conversation)
            .filter(
                Conversation.user_id == user_id,
                Conversation.deleted_at.is_(None)
            )
            .count()
        )

        # Get average messages per conversation
        avg_messages = message_count / conversation_count if conversation_count > 0 else 0

        stats = {
            "total_conversations": conversation_count,
            "total_messages": message_count,
            "avg_messages_per_conversation": round(avg_messages, 2)
        }

        return create_response(True, stats, "User statistics retrieved successfully", 200)
    except Exception as e:
        return create_response(False, None, str(e), 500)

def get_system_stats():
    """Get overall system statistics."""
    try:
        # Get total users
        total_users = User.query.filter_by(deleted_at=None).count()

        # Get total conversations
        total_conversations = Conversation.query.filter_by(deleted_at=None).count()

        # Get total messages
        total_messages = (
            Message.query.join(Conversation)
            .filter(Conversation.deleted_at.is_(None))
            .count()
        )

        # Get average messages per conversation
        avg_messages = total_messages / total_conversations if total_conversations > 0 else 0

        # Get active users in last 7 days
        week_ago = datetime.utcnow() - timedelta(days=7)
        active_users = (
            User.query.join(Conversation)
            .filter(
                Conversation.created_at >= week_ago,
                User.deleted_at.is_(None)
            )
            .distinct()
            .count()
        )

        stats = {
            "total_users": total_users,
            "total_conversations": total_conversations,
            "total_messages": total_messages,
            "avg_messages_per_conversation": round(avg_messages, 2),
            "active_users_last_7_days": active_users
        }

        return create_response(True, stats, "System statistics retrieved successfully", 200)
    except Exception as e:
        return create_response(False, None, str(e), 500) 