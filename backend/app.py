from flask import Flask
from dotenv import load_dotenv
from models import db
from routes import main_bp
from flask_cors import CORS
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

CORS(app,resources={r"/api/*": {"origins": "*"}},supports_credentials=True)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set in the environment variables!")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

# Initialize database
db.init_app(app)

# Function to create tables and test DB connection
def setup_database():
    try:
        with app.app_context():
            db.create_all()  # ✅ Correct way to create tables
            print("✅ Tables created successfully!")
            print("✅ PostgreSQL is connected!")
    except Exception as e:
        print(f"❌ Database setup failed: {str(e)}")
        exit(1)

setup_database()

# Register blueprints
try:
    app.register_blueprint(main_bp, url_prefix='/api')
except Exception as e:
    print(f"Error registering blueprint: {str(e)}")
    exit(1)

if __name__ == '__main__':
    print("Running the server on port 5000")
    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
