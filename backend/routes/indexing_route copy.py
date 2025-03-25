from flask import Blueprint, request, jsonify
from flask_socketio import emit
from services import start_indexing
from utils.logger import STATUS
import threading
import time

vectorization_bp = Blueprint("vectorization", __name__)

def emit_log(message: str):
    """Helper function to emit logs through socket.io"""
    emit('indexing_log', {'message': message}, namespace='/')

def emit_status(status: str):
    """Helper function to emit status updates through socket.io"""
    emit('indexing_status', {'status': status}, namespace='/')

def monitor_indexing_progress(folder_name: str):
    """Monitor and emit indexing progress"""
    try:
        emit_log(f"Starting indexing process for folder: {folder_name}")
        emit_status("Starting")
        
        # Start the indexing process
        start_indexing(folder_name)
        
        # Monitor the STATUS dictionary for updates
        while STATUS["running"]:
            if "current_file" in STATUS:
                emit_log(f"Processing file: {STATUS['current_file']}")
            if "progress" in STATUS:
                emit_status(f"Progress: {STATUS['progress']}%")
            time.sleep(0.5)  # Update every 500ms
        
        emit_log("✅ Indexing completed successfully")
        emit_status("Completed")
    except Exception as e:
        emit_log(f"❌ Error during indexing: {str(e)}")
        emit_status("Error")
        STATUS["running"] = False
        STATUS["error"] = str(e)

@vectorization_bp.route("/", methods=["POST"])
def trigger_indexing():
    data = request.json
    folder_name = data.get("folder")

    """API to trigger indexing process dynamically."""
    
    if not data or "folder" not in data:
        return jsonify({"error": "Missing 'folder' in request body"}), 400

    if STATUS["running"]:
        return jsonify({"error": "Indexing is already running"}), 409

    # Start indexing in a separate thread
    thread = threading.Thread(
        target=monitor_indexing_progress,
        args=(folder_name,),
        daemon=True
    )
    thread.start()

    return jsonify({"message": f"Indexing started for folder: {folder_name} 🚀"}), 202

@vectorization_bp.route("/stop", methods=["POST"])
def stop_indexing():
    """API to stop the indexing process."""
    if not STATUS["running"]:
        return jsonify({"message": "No indexing process is currently running"}), 200
    
    STATUS["running"] = False
    emit_log("⚠️ Indexing process stopped by user")
    emit_status("Stopped")
    
    return jsonify({"message": "Indexing process stopped successfully"}), 200
