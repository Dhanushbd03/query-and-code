import os
from qdrant_client import QdrantClient
from langchain_qdrant import Qdrant
from dotenv import load_dotenv
import logging
# Load environment variables
load_dotenv()

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")

logging.basicConfig(level=logging.INFO)

if not QDRANT_API_KEY or not QDRANT_URL:
    raise ValueError("QDRANT_API_KEY or QDRANT_URL is missing from environment variables.")

def store_in_qdrant(documents, embedding_model, collection_name="react"):
    """Stores documents in Qdrant VectorDB with progress tracking."""
    
    if not documents:
        raise ValueError("No documents to store!")

    logging.info(f"Connecting to Qdrant at {QDRANT_URL}...")
    
    # Initialize Qdrant client
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

    # Check if the collection already exists
    existing_collections = [c.name for c in client.get_collections().collections]
    if collection_name in existing_collections:
        logging.info(f"Collection '{collection_name}' already exists. Deleting it first...")
        client.delete_collection(collection_name)

    logging.info(f"Creating new collection '{collection_name}' and storing documents...")

    # Process documents in chunks to track progress
    batch_size = 10  # Adjust based on your needs
    total_docs = len(documents)

    for i in range(0, total_docs, batch_size):
        batch = documents[i : i + batch_size]
        
        Qdrant.from_documents(
            batch,
            embedding_model,
            url=QDRANT_URL,
            prefer_grpc=True,
            api_key=QDRANT_API_KEY,
            collection_name=collection_name,
        )

        logging.info(f"Stored {min(i + batch_size, total_docs)} / {total_docs} documents...")

    logging.info("✅ Indexing completed successfully!")
    return True
