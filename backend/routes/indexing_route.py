from flask import Blueprint, request, jsonify
from services import start_indexing
from models import Language
from utils.logger import STATUS
from utils import create_response
from socket_instance import socketio
import threading
import time

indexing_bp = Blueprint("indexing", __name__)

def emit_log(message: str):
    socketio.emit('indexing_log', {'message': message}, namespace='/')

def monitor_indexing_progress(folder_name: str):
    """Monitor and emit indexing progress"""
    try:
        emit_log(f"Starting indexing process for folder: {folder_name}")
        
        # Start the indexing process
        start_indexing(folder_name)
        
        emit_log("✅ Indexing completed successfully")
    except Exception as e:
        emit_log(f"❌ Error during indexing: {str(e)}")
        STATUS["running"] = False
        STATUS["error"] = str(e)

@indexing_bp.route("/", methods=["POST"])
def trigger_indexing():
    data = request.json
    language_id = data.get("language_id")

    """API to trigger indexing process dynamically."""
    
    if not data or "language_id" not in data:
        return jsonify({"error": "Missing 'language_id' in request body"}), 400

    if STATUS["running"]:
        return jsonify({"error": "Indexing is already running"}), 409

    language = Language.query.get(language_id)
    if not language:
        return jsonify({"error": "Language not found"}), 404

    print(f"Starting indexing for language: {language.name}")
    # Start indexing in a separate thread
    thread = threading.Thread(
        target=monitor_indexing_progress,
        args=(language.name,),
        daemon=True
    )
    thread.start()

    return create_response(True, None, "Indexing started for language: " + language.name, 202)

@indexing_bp.route("/stop", methods=["POST"])
def stop_indexing():
    """API to stop the indexing process."""
    if not STATUS["running"]:
        return jsonify({"message": "No indexing process is currently running"}), 200
    
    STATUS["running"] = False
    emit_log("⚠️ Indexing process stopped by user")
    
    return jsonify({"message": "Indexing process stopped successfully"}), 200
