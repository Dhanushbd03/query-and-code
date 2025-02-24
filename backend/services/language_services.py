from models import db
from models.language import Language

def get_all_languages():
    """Fetch all languages from the database."""
    try:
        languages = Language.query.all()
        data = [{"id": lang.id, "name": lang.name, "description": lang.description} for lang in languages]
        return data, 200
    except Exception as e:
        return str(e), 500
