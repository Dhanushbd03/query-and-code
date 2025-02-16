import os
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is missing from environment variables.")

def get_embedding_model():
    """Returns the embedding model instance."""
    return HuggingFaceInferenceAPIEmbeddings(api_key=HF_TOKEN)
