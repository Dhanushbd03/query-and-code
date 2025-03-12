from flask import Blueprint, request, jsonify
from services import start_indexing
from utils.logger import STATUS

indexing_bp = Blueprint("indexing", __name__)


@indexing_bp.route("/", methods=["POST"])
def trigger_indexing():
    data = request.json
    folder_name = data.get("folder")

    """API to trigger indexing process dynamically."""
    
    if not data or "folder" not in data:
        return jsonify({"error": "Missing 'folder' in request body"}), 400

    if STATUS["running"]:
        return jsonify({"error": "Indexing is already running"}), 409

    start_indexing(folder_name)
    return jsonify({"message": f"Indexing started for folder: {folder_name} 🚀"}), 202


@indexing_bp.route("/status", methods=["GET"])
def get_status():
    """API to check indexing status."""
    return jsonify(STATUS), 200
