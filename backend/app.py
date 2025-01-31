from flask import Flask
from dotenv import load_dotenv
# from routes.generateResponse import generateResponse
from models import db
from routes import main_bp
import os
# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

try:
    # app.register_blueprint(generateResponse,url_prefix='/api')
    app.register_blueprint(main_bp)  
except Exception as e:
    print(f"Error registering blueprint: {str(e)}")
    exit(1)

if __name__ == '__main__':
    print("Running the server in port 5000")
    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
