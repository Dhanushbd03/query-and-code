from models import db, BaseModel
from datetime import datetime, UTC
from sqlalchemy.orm import relationship 
from sqlalchemy.sql import func


class Conversation(BaseModel):
    __tablename__ = "conversation"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    created_at = db.Column(
        db.DateTime, default=func.now(), server_default=func.now()  # ✅ Fix
    )
    language_id = db.Column(db.Integer, db.ForeignKey("languages.id"), nullable=False)
    language = relationship("Language", backref="conversations")
