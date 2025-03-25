import os
import threading
import datetime
from langchain_community.document_loaders import DirectoryLoader
from langchain_qdrant import Qdrant
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from utils.config import HF_TOKEN, QDRANT_API_KEY, QDRANT_URL
from utils.logger import setup_logging, STATUS
from socket_instance import socketio
from tqdm import tqdm

BASE_CONTENT_DIR = 'content'  # Base directory for markdown files


def emit_log(message: str, type: str = "info"):
    """Emit logs through socket.io"""
    socketio.emit('indexing_log', {'message': message}, namespace='/')

def update_progress(progress: int, message: str):
    """Update progress and emit log"""
    STATUS["progress"] = progress
    emit_log(f"{message} ({progress}%)")

def index_documents(folder_name):
    """Loads, processes, and stores markdown documents into Qdrant."""
    global STATUS
    STATUS["running"] = True
    STATUS["folder"] = folder_name
    STATUS["progress"] = 0
    STATUS["current_file"] = None
    STATUS["error"] = None
    log_file = setup_logging()
    STATUS["logs"] = log_file

    emit_log(f"🚀 Starting indexing for folder: {folder_name}")
    update_progress(0, "Starting")

    try:
        # Check if directory exists
        data_dir = os.path.join(BASE_CONTENT_DIR, folder_name)
        if not os.path.exists(data_dir):
            error_msg = f"❌ Folder not found: {data_dir}"
            emit_log(error_msg, "error")
            STATUS["error"] = error_msg
            STATUS["running"] = False
            emit_log("Error", "error")
            return

        # Load documents - 0% to 20%
        emit_log("🔄 Loading Markdown files...")
        loader = DirectoryLoader(path=data_dir, glob="**/*.md", show_progress=True)
        docs = loader.load()
        total_files = len(docs)
        update_progress(20, f"✅ Loaded {total_files} Markdown files")

        if not STATUS["running"]:
            emit_log("⚠️ Vectorization stopped by user", "warning")
            emit_log("Stopped", "warning")
            return

        # Split documents - 20% to 30%
        emit_log("🔄 Splitting documents into chunks...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_documents(docs)
        total_chunks = len(texts)
        update_progress(30, f"✅ Created {total_chunks} chunks")

        if not STATUS["running"]:
            emit_log("⚠️ Vectorization stopped by user", "warning")
            emit_log("Stopped", "warning")
            return

        # Initialize embedding model - 30% to 40%
        emit_log("🔄 Loading embedding model...")
        embedding = HuggingFaceInferenceAPIEmbeddings(api_key=HF_TOKEN)
        update_progress(40, "✅ Embedding model loaded")

        if not STATUS["running"]:
            emit_log("⚠️ Vectorization stopped by user", "warning")
            emit_log("Stopped", "warning")
            return

        # Embedding and indexing - 40% to 95%
        emit_log("🚀 Creating embeddings and indexing documents...")
        chunk_size = 10
        for i in range(0, len(texts), chunk_size):
            if not STATUS["running"]:
                emit_log("⚠️ Vectorization stopped by user", "warning")
                emit_log("Stopped", "warning")
                return
            
            current_chunk = texts[i:i + chunk_size]
            progress = int(40 + (i / len(texts) * 55))  # Progress from 40% to 95%
            update_progress(progress, f"Processing chunks {i+1}-{min(i+chunk_size, len(texts))} of {len(texts)}")
            
            # Process chunk
            if i == 0:
                # First chunk - create collection
                qdrant = Qdrant.from_documents(
                    current_chunk,
                    embedding,
                    url=QDRANT_URL,
                    prefer_grpc=True,
                    api_key=QDRANT_API_KEY,
                    collection_name=folder_name,
                )
            else:
                # Add to existing collection
                qdrant.add_documents(current_chunk)

        # Final steps - 95% to 100%
        update_progress(100, "✅ Indexing completed")
        emit_log("Completed", "success")

    except Exception as e:
        error_msg = f"❌ Error: {e}"
        emit_log(error_msg, "error")
        STATUS["error"] = error_msg
        emit_log("Error", "error")

    finally:
        STATUS["running"] = False
        STATUS["last_run"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        emit_log("✅ Indexing process finished.")

def start_indexing(folder_name):
    """Runs indexing in a separate thread."""
    thread = threading.Thread(target=index_documents, args=(folder_name,), daemon=True)
    thread.start()
