from models import db
from models.language import Language

def get_all_languages():
    """Fetch all languages from the database."""
    try:
        languages = Language.query.all()
        return [language.to_dict() for language in languages], 200
    except Exception as e:
        return str(e), 500

def create_language(name: str, description: str = None, github_url: str = None):
    """Create a new language."""
    try:
        language = Language(name=name)
        language.description = description
        language.github_url = github_url
        db.session.add(language)
        db.session.commit()
        return language.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return str(e), 500

def update_language(language_id: str, data: dict):
    """Update an existing language."""
    try:
        language = Language.query.get(language_id)
        if not language:
            return "Language not found", 404

        if 'name' in data:
            language.name = data['name']
        if 'description' in data:
            language.description = data['description']
        if 'github_url' in data:
            language.github_url = data['github_url']

        db.session.commit()
        return language.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        return str(e), 500

def delete_language(language_id: str):
    """Delete a language."""
    try:
        language = Language.query.get(language_id)
        if not language:
            return "Language not found", 404

        db.session.delete(language)
        db.session.commit()
        return None, 200
    except Exception as e:
        db.session.rollback()
        return str(e), 500
