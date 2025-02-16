import os
import threading
import logging
import datetime
from langchain_community.document_loaders import DirectoryLoader
from langchain_qdrant import Qdrant
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from utils.config import HF_TOKEN, QDRANT_API_KEY, QDRANT_URL
from utils.logger import setup_logging, STATUS

BASE_CONTENT_DIR = 'content'  # Base directory for markdown files

def index_documents(folder_name):
    """Loads, processes, and stores markdown documents into Qdrant."""
    global STATUS
    STATUS["running"] = True
    STATUS["folder"] = folder_name
    log_file = setup_logging()
    STATUS["logs"] = log_file

    logging.info(f"🚀 Starting indexing for folder: {folder_name}")

    try:
        data_dir = os.path.join(BASE_CONTENT_DIR, folder_name)
        if not os.path.exists(data_dir):
            logging.error(f"❌ Folder not found: {data_dir}")
            STATUS["running"] = False
            return

        logging.info("🔄 Loading Markdown files...")
        loader = DirectoryLoader(path=data_dir, glob="**/*.md", show_progress=True)
        docs = loader.load()
        logging.info(f"✅ Total Markdown Files Found: {len(docs)}")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_documents(docs)
        logging.info(f"✅ Total Chunks After Splitting: {len(texts)}")

        embedding = HuggingFaceInferenceAPIEmbeddings(api_key=HF_TOKEN)
        logging.info("✅ Embedding model loaded.")

        logging.info("🚀 Indexing documents into Qdrant...")
        qdrant = Qdrant.from_documents(
            texts,
            embedding,
            url=QDRANT_URL,
            prefer_grpc=True,
            api_key=QDRANT_API_KEY,
            collection_name=folder_name,  # Dynamic collection name
        )
        logging.info("✅ Indexing completed successfully!")

    except Exception as e:
        logging.error(f"❌ Error: {e}")

    finally:
        STATUS["running"] = False
        STATUS["last_run"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        logging.info("✅ Indexing process finished.")

def start_indexing(folder_name):
    """Runs indexing in a separate thread."""
    thread = threading.Thread(target=index_documents, args=(folder_name,))
    thread.start()
