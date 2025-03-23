import os
import sys
from pathlib import Path

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent)
sys.path.append(project_root)

from flask import Flask
from models import db
from models.admin import Admin
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL is not set in the environment variables!")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

def create_admin(email, username, password):
    """Create a new admin user"""
    try:
        app = create_app()
        with app.app_context():
            # Check if admin already exists
            existing_admin = Admin.query.filter_by(email=email).first()
            if existing_admin:
                print(f"❌ Admin with email {email} already exists!")
                return False
            
            # Create new admin
            admin = Admin(username=username, email=email, password=password)
            db.session.add(admin)
            db.session.commit()
            print(f"✅ Admin user created successfully!")
            print(f"Email: {email}")
            print(f"Username: {username}")
            return True
    except Exception as e:
        print(f"❌ Error creating admin: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python create_admin.py <email> <username> <password>")
        sys.exit(1)
    
    email = sys.argv[1]
    username = sys.argv[2]
    password = sys.argv[3]
    
    create_admin(email, username, password) 