import os
import logging
import requests
from dotenv import load_dotenv
from typing import Optional, Callable
import time

# Set up logging for the scraper script
logging.basicConfig(
    filename='logs.txt',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

# Load environment variables
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API_URL = "https://api.github.com/repos/{owner}/{repo}/contents/{path}"

# Ensure credentials are loaded
if not GITHUB_TOKEN:
    logging.error("❌ Missing GITHUB_TOKEN. Check .env file!")
    raise ValueError("❌ Missing GITHUB_TOKEN. Check .env file!")

logging.info("✅ GitHub Token loaded successfully.")

# Function to fetch and download .md files from GitHub
def fetch_md_files_from_github(owner: str, repo: str, path: str, destination_directory: str, token: str, log_callback: Optional[Callable[[str], bool]] = None) -> None:
    base_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    try:
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()
        contents = response.json()

        if not isinstance(contents, list):
            contents = [contents]

        for item in contents:
            if not log_callback or not log_callback(f"🔍 Processing: {item['path']}"):
                return

            if item['type'] == 'file' and item['name'].endswith('.md'):
                file_path = os.path.join(destination_directory, item['name'])
                if not os.path.exists(file_path):
                    if not log_callback or not log_callback(f"📥 Attempting to save file: {item['name']}"):
                        return
                    try:
                        response = requests.get(item['download_url'], headers=headers)
                        response.raise_for_status()
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(response.text)
                        if not log_callback or not log_callback(f"✅ Successfully saved file: {item['name']}"):
                            return
                    except Exception as e:
                        if not log_callback or not log_callback(f"❌ Failed to save file {item['name']}: {str(e)}"):
                            return
                else:
                    if not log_callback or not log_callback(f"⚠️ File already exists, skipping: {item['name']}"):
                        return

            elif item['type'] == 'dir':
                if not log_callback or not log_callback(f"📂 Entering directory: {item['path']}"):
                    return
                fetch_md_files_from_github(owner, repo, item['path'], destination_directory, token, log_callback)

            time.sleep(0.1)  # Rate limiting

    except requests.exceptions.RequestException as e:
        error_msg = f"Error fetching content: {str(e)}"
        if log_callback:
            log_callback(f"❌ {error_msg}")
        raise Exception(error_msg)

# Function to download a file from GitHub and save it locally
def download_and_copy_file(owner, repo, file_path, dest_dir, token=None, log_callback=None):
    headers = {}
    if token:
        headers["Authorization"] = f"token {token}"
        headers["Accept"] = "application/vnd.github.v3.raw"

    message = f"🔍 Fetching raw content of file: {file_path}"
    logging.info(message)
    if log_callback:
        log_callback(message)

    try:
        raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{file_path}"
        message = f"📡 Downloading from: {raw_url}"
        logging.info(message)
        if log_callback:
            log_callback(message)
        
        response = requests.get(raw_url, headers=headers)
        response.raise_for_status()
        
        file_name = os.path.basename(file_path)
        folder_name = os.path.basename(os.path.dirname(file_path))

        # Ensure the destination directory exists
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        # Create the full path for the local file (with folder name prefix if needed)
        dest_file_path = os.path.join(dest_dir, f"{folder_name}_{file_name}")

        # Skip downloading if the file already exists
        if os.path.exists(dest_file_path):
            message = f"⚠️ File {dest_file_path} already exists, skipping..."
            logging.info(message)
            if log_callback:
                log_callback(message)
            return

        # Write the file to the destination directory
        with open(dest_file_path, 'wb') as f:
            f.write(response.content)
            message = f"✅ Downloaded and copied: {dest_file_path}"
            logging.info(message)
            if log_callback:
                log_callback(message)
    except requests.exceptions.RequestException as e:
        error_msg = f"❌ Failed to download {file_path}: {str(e)}"
        logging.error(error_msg)
        if log_callback:
            log_callback(error_msg)
        raise ValueError(error_msg)
