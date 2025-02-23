from datetime import datetime
from models import db


class BaseModel(db.Model):
    """Base model with a serialize method for all models."""

    __abstract__ = True  # Prevents table creation for this class

    def serialize(self):
        """Convert model instance to dictionary."""
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        }

    def serialize_with_iso_dates(self):
        """Convert model instance to dictionary with ISO-formatted dates."""
        serialized_data = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                serialized_data[column.name] = (
                    value.isoformat()
                )  # Convert datetime fields
            else:
                serialized_data[column.name] = value
        return serialized_data
