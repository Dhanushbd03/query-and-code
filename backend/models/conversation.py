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
    language_id = db.Column(UUID(as_uuid=True), db.ForeignKey("languages.id"), nullable=False)
    language = relationship("Language", backref="conversations")
