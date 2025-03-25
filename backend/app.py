from flask import Flask
from dotenv import load_dotenv
from models import db
from routes import main_bp
from routes.admin import admin_bp
from flask_cors import CORS
from flask_migrate import Migrate
from socket_instance import socketio
import os

load_dotenv()

app = Flask(__name__)

# Configure CORS to allow all origins during development
CORS(app, 
     resources={r"/*": {"origins": "*"}},  # Allow all routes including socket.io
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set in the environment variables!")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

# Initialize database
db.init_app(app)

# Function to create tables and test DB connection
migrate = Migrate(app, db)

# Register blueprints
try:
    app.register_blueprint(main_bp, url_prefix='/api')
except Exception as e:
    print(f"Error registering blueprint: {str(e)}")
    exit(1)

# Initialize socket.io
socketio.init_app(app)

if __name__ == '__main__':
    print("Running the server on port 5000")
    try:
        socketio.run(app, debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
