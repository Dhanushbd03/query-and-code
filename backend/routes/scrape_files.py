import os
import logging
from flask import Blueprint, jsonify, request
from flask_socketio import emit
from scripts import fetch_md_files_from_github
from dotenv import load_dotenv
import re
import threading
import queue
from socket_instance import socketio
import time
from models import db , Language

def parse_github_url(url):
    """
    Parse a GitHub URL to extract owner and repository name.
    Handles various GitHub URL formats including:
    - https://github.com/owner/repo
    - https://github.com/owner/repo.git
    - git@github.com:owner/repo.git
    """
    # Remove .git suffix if present
    url = url.rstrip('.git')
    
    # Handle SSH format
    if url.startswith('git@github.com:'):
        parts = url.split(':')[1].split('/')
        if len(parts) == 2:
            return parts[0], parts[1]
    
    # Handle HTTPS format
    if 'github.com' in url:
        parts = url.split('github.com/')[-1].split('/')
        if len(parts) >= 2:
            return parts[0], parts[1]
    
    return None, None

logging.basicConfig(
    filename='flask_logs.txt',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

load_dotenv()

script_bp = Blueprint("scripts", __name__)

log_queue = queue.Queue()
stop_scraping = threading.Event()

def log_worker():
    while True:
        message = log_queue.get()
        if message is None:
            break
        logging.info(message)
        try:
            # Emit to all connected clients
            print(f"Emitting log message: {message}")  # Debug print
            socketio.emit('scrape_log', {'message': message}, namespace='/')
            logging.info(f"Emitted log message: {message}")
        except Exception as e:
            print(f"Error emitting log message: {str(e)}")  # Debug print
            logging.error(f"Failed to emit log message: {str(e)}")
        time.sleep(0.1)

def scrape_with_logging(owner, repo, destination_directory, token):
    try:
        print("Starting scrape_with_logging")  # Debug print
        worker_thread = threading.Thread(target=log_worker)
        worker_thread.start()

        # Send initial messages
        initial_message = f"Starting GitHub scraping for {owner}/{repo}"
        print(f"Queueing initial message: {initial_message}")  # Debug print
        log_queue.put(initial_message)
        log_queue.put(f"Files will be saved to: {destination_directory}")

        if not os.path.exists(destination_directory):
            os.makedirs(destination_directory)
            log_queue.put(f"Created directory: {destination_directory}")

        if not token:
            error_msg = "GitHub token not found. Please set GITHUB_TOKEN environment variable."
            log_queue.put(f"❌ {error_msg}")
            raise ValueError(error_msg)

        def log_callback(message):
            if stop_scraping.is_set():
                log_queue.put("⚠️ Scraping stopped by user")
                return False
            print(f"Queueing log message: {message}")  # Debug print
            log_queue.put(message)
            return True

        fetch_md_files_from_github(owner, repo, "", destination_directory, token, log_callback)

        if not stop_scraping.is_set():
            log_queue.put("🎉 Scraping completed successfully!")
            log_queue.put(f"Files have been saved to: {destination_directory}")
        else:
            log_queue.put("⚠️ Scraping stopped by user")

        log_queue.put(None)
        worker_thread.join()

    except Exception as e:
        if not stop_scraping.is_set():
            log_queue.put(f"❌ Error during scraping: {str(e)}")
        log_queue.put(None)
        worker_thread.join()
        raise

@script_bp.route("/scrape", methods=["POST"])
def trigger_script():
    try:
        data = request.get_json()
        language_id = data.get('language_id')

        if not language_id:
            return jsonify({
                "success": False,
                "message": "Missing required parameter: language_id"
            }), 400

        # Get language from database
        language = Language.query.get(language_id)
        if not language:
            return jsonify({
                "success": False,
                "message": f"Language with ID {language_id} not found"
            }), 404

        if not language.github_url:
            return jsonify({
                "success": False,
                "message": f"No GitHub URL found for language {language.name}"
            }), 400

        owner, repo = parse_github_url(language.github_url)
        if not owner or not repo:
            return jsonify({
                "success": False,
                "message": "Invalid GitHub URL format"
            }), 400

        destination_directory = os.path.join("content", language.name.lower())
        token = os.getenv("GITHUB_TOKEN")

        if not token:
            return jsonify({
                "success": False,
                "message": "GitHub token not found. Please set GITHUB_TOKEN environment variable."
            }), 500

        stop_scraping.clear()
        thread = threading.Thread(
            target=scrape_with_logging,
            args=(owner, repo, destination_directory, token)
        )
        thread.start()

        return jsonify({
            "success": True,
            "message": "Scraping started successfully",
            "data": {
                "destination": destination_directory,
                "owner": owner,
                "repo": repo
            }
        }), 200

    except Exception as e:
        logging.error(f"❌ An error occurred while triggering the script: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

@script_bp.route("/stop", methods=["POST"])
def stop_script():
    try:
        stop_scraping.set()
        # Emit stop message to all clients
        socketio.emit('scrape_log', {'message': '⚠️ Scraping stopped by user'}, broadcast=True)
        return jsonify({
            "success": True,
            "message": "Scraping stopped successfully"
        }), 200
    except Exception as e:
        logging.error(f"❌ An error occurred while stopping the script: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

@socketio.on('connect')
def handle_connect():
    logging.info('Client connected')
    # Send welcome message to the newly connected client
    emit('scrape_log', {'message': 'Connected to scraping service'})

@socketio.on('disconnect')
def handle_disconnect():
    logging.info('Client disconnected')

