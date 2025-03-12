from models import User, db


def GetAllUsersService():
    sql = """
    SELECT 
        u.id as user_id, 
        u.name, 
        u.email, 
        u.username, 
        u.created_at as user_created_at,
        COUNT(c.id) as conversation_count
    FROM 
        users u
    LEFT JOIN 
        conversation c ON u.id = c.user_id
    GROUP BY 
        u.id, u.name, u.email, u.username, u.created_at
    ORDER BY 
        u.name
    """

    result = db.session.execute(sql)

    users_list = []
    for row in result:
        users_list.append(
            {
                "id": str(row.user_id),
                "name": row.name,
                "email": row.email,
                "username": row.username,
                "created_at": (
                    row.user_created_at.isoformat() if row.user_created_at else None
                ),
                "conversation_count": row.conversation_count,
            }
        )

    return users_list
