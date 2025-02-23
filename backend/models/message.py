from models import db, BaseModel
from datetime import datetime, UTC
from sqlalchemy.sql import func

class Message(BaseModel):
    __tablename__ = "message"  
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(
        db.Integer, db.ForeignKey("conversation.id"), nullable=False
    )
    sender = db.Column(db.String(10), nullable=False)  # "user" or "bot"
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(
        db.DateTime, default=func.now(), server_default=func.now()  # ✅ Fix
    )
