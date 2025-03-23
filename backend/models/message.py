from models import db, BaseModel
from datetime import datetime, UTC
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Message(BaseModel):
    __tablename__ = "message"  
    id = db.Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    conversation_id = db.Column(
        UUID(as_uuid=True), 
        db.ForeignKey("conversation.id", ondelete="CASCADE"), 
        nullable=False
    )
    sender = db.Column(db.String(10), nullable=False)  # "user" or "bot"
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(
        db.DateTime, default=func.now(), server_default=func.now()
    )
    deleted_at = db.Column(db.DateTime, nullable=True)

    def soft_delete(self):
        """Soft delete the message"""
        self.deleted_at = datetime.now(UTC)
        db.session.commit()

    @classmethod
    def get_active_messages(cls, conversation_id):
        """Get all non-deleted messages for a conversation"""
        return cls.query.filter(
            cls.conversation_id == conversation_id,
            cls.deleted_at.is_(None)
        ).order_by(cls.timestamp.asc()).all()
