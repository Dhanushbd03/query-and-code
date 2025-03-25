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
    github_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(
        db.DateTime, default=func.now(), server_default=func.now() 
    )
    updated_at = db.Column(
        db.DateTime, default=func.now(), onupdate=func.now()
    )

    def __init__(self, name):
        self.name = name

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "github_url": self.github_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
