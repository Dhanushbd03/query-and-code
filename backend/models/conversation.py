import uuid
from models import db, BaseModel
from datetime import datetime, UTC
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID


class Conversation(BaseModel):
    __tablename__ = "conversation"

    id = db.Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    user_id = db.Column(UUID(as_uuid=True), nullable=False)
    created_at = db.Column(
        db.DateTime, default=func.now(), server_default=func.now()  # ✅ Fix
    )
    deleted_at = db.Column(db.DateTime, nullable=True)
    language_id = db.Column(UUID(as_uuid=True), db.ForeignKey("languages.id"), nullable=False)
    language = relationship("Language", backref="conversations")
    
    # Add messages relationship with cascade delete
    messages = relationship("Message", backref="conversation", cascade="all, delete-orphan")

    def soft_delete(self):
        """Soft delete the conversation by setting deleted_at timestamp"""
        self.deleted_at = datetime.now(UTC)
        db.session.commit()

    @classmethod
    def get_active_conversations(cls):
        """Get all conversations that haven't been soft deleted"""
        return cls.query.filter(cls.deleted_at.is_(None)).all()

    @classmethod
    def get_by_id(cls, conversation_id):
        """Get a conversation by ID if it hasn't been soft deleted"""
        return cls.query.filter(cls.id == conversation_id, cls.deleted_at.is_(None)).first()
