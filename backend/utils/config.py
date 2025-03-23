import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv('HF_TOKEN')
QDRANT_API_KEY = os.getenv('QDRANT_API_KEY')
QDRANT_URL = os.getenv("QDRANT_URL")
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')