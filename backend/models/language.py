from models import db, BaseModel
from sqlalchemy.sql import func

class Language(BaseModel):
    __tablename__ = "languages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(
        db.DateTime, default=func.now(), server_default=func.now()  # ✅ Fix here
    )

    def __init__(self, name):
        self.name = name
