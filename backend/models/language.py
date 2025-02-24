from models import db, BaseModel
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Language(BaseModel):
    __tablename__ = "languages"

    id = db.Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(
        db.DateTime, default=func.now(), server_default=func.now() 
    )

    def __init__(self, name):
        self.name = name
