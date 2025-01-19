from flask import Flask
from dotenv import load_dotenv
from routes.generateResponse import generateResponse
# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

try:
    app.register_blueprint(generateResponse,url_prefix='/api')
except Exception as e:
    print(f"Error registering blueprint: {str(e)}")
    exit(1)

if __name__ == '__main__':
    print("Running the server in port 5000")
    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
+