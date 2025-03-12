from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy() 


from .base import BaseModel
from .user import User
from .message import Message
from .conversation import Conversation
from .language import Language
from .admin import Admin