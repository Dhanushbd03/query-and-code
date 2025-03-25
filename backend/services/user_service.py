from models import User, db, Conversation
from sqlalchemy import text, func
from datetime import datetime
from utils import create_response


def GetAllUsersService():
    sql = text("""
    WITH user_stats AS (
        SELECT 
            u.id,
            u.username,
            u.email,
            u.created_at,
            COUNT(DISTINCT c.id) as conversation_count,
            COUNT(DISTINCT c.language_id) as languages_interacted,
            EXTRACT(DAYS FROM (NOW() - u.created_at)) as days_used
        FROM users u
        LEFT JOIN conversation c ON u.id = c.user_id AND c.deleted_at IS NULL
        GROUP BY u.id, u.username, u.email, u.created_at
        ORDER BY u.created_at DESC
    )
    SELECT * FROM user_stats
    """)
    
    result = db.session.execute(sql)
    users = []
    for row in result:
        user_dict = {
            'id': str(row[0]),  # Convert UUID to string
            'username': row[1],
            'email': row[2],
            'created_at': row[3].isoformat() if row[3] else None,  # Convert datetime to ISO format
            'stats': {
                'conversation_count': row[4] or 0,
                'languages_interacted': row[5] or 0,
                'days_used': int(row[6] or 0)
            }
        }
        users.append(user_dict)
    return users