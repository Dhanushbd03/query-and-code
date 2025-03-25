from models import db
from datetime import datetime

class LanguageGithub(db.Model):
    __tablename__ = 'language_github'

    id = db.Column(db.Integer, primary_key=True)
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), nullable=False)
    github_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with Language model
    language = db.relationship('Language', backref=db.backref('github_urls', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'language_id': self.language_id,
            'github_url': self.github_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'language_name': self.language.name if self.language else None
        } 