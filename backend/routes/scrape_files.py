import os
import logging
from flask import Blueprint, jsonify
from scripts import fetch_md_files_from_github  # Import the scraping function
from dotenv import load_dotenv

# Set up logging for the Flask app controller
logging.basicConfig(
    filename='flask_logs.txt',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

# Load environment variables
load_dotenv()

# Blueprint setup for Flask routes
script_bp = Blueprint("scripts", __name__)

@script_bp.route("/", methods=["GET"])
def trigger_script():
    log_file = "logs.txt"  # Log file for the script's execution

    try:
        # Step 1: Trigger the GitHub scraper script (this runs the actual scraping)
        logging.info("📝 Triggering GitHub scraper script.")
        
        # Example usage of the function in the scraper script
        owner = "angular"  # GitHub repo owner
        repo = "angular"   # GitHub repo name
        token = os.getenv("GITHUB_TOKEN")  # GitHub personal access token
        destination_directory = "content/angular"  # Destination folder

        # Trigger the scraping function (this downloads the .md files)
        fetch_md_files_from_github(owner, repo, "", destination_directory, token)

        logging.info("🎉 Script executed successfully!")

        # Step 2: Read the log file content after the script completes
        if os.path.exists(log_file):
            with open(log_file, "r") as log:
                log_content = log.read()

            # Step 3: Return the logs as part of the response
            return jsonify({
                "message": "GitHub scraping completed successfully",
                "logs": log_content
            }), 200
        else:
            logging.error("❌ Log file not found.")
            return jsonify({
                "message": "Log file not found.",
                "logs": ""
            }), 500

    except Exception as e:
        logging.error(f"❌ An error occurred while triggering the script: {str(e)}")
        return jsonify({
            "message": f"An error occurred: {str(e)}",
            "logs": ""
        }), 500

