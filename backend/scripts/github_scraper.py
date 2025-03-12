import os
import logging
import requests
from dotenv import load_dotenv

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
def fetch_md_files_from_github(owner, repo, path, dest_dir, token=None):
    # Prepare headers for GitHub API request (if a token is provided)
    headers = {}
    if token:
        headers["Authorization"] = f"token {token}"

    logging.info(f"🔍 Fetching files from GitHub repository: {owner}/{repo} at path {path}")

    # Make a request to GitHub API to get the directory contents
    response = requests.get(GITHUB_API_URL.format(owner=owner, repo=repo, path=path), headers=headers)
    
    # If the request is successful
    if response.status_code == 200:
        files = response.json()

        logging.info(f"📂 {len(files)} files found at path {path}.")
        
        for file in files:
            file_path = file['path']
            
            # If the file is a directory, recurse into it
            if file['type'] == 'dir':
                logging.info(f"➡️ Found directory: {file_path}. Recursing...")
                fetch_md_files_from_github(owner, repo, file_path, dest_dir, token)
            
            # If the file is a .md file, download it
            elif file['name'].endswith('.md'):
                logging.info(f"✅ Found .md file: {file_path}. Downloading...")
                download_and_copy_file(owner, repo, file_path, dest_dir, token)
    else:
        logging.error(f"❌ Failed to fetch files from GitHub: {response.status_code}, {response.text}")
        raise ValueError(f"Failed to fetch files from GitHub: {response.status_code}, {response.text}")

# Function to download a file from GitHub and save it locally
def download_and_copy_file(owner, repo, file_path, dest_dir, token=None):
    # Prepare headers for GitHub API request (if a token is provided)
    headers = {}
    if token:
        headers["Authorization"] = f"token {token}"

    logging.info(f"🔍 Fetching raw content of file: {file_path}")

    # Fetch the raw content of the file
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{file_path}"
    response = requests.get(raw_url, headers=headers)
    
    if response.status_code == 200:
        file_name = os.path.basename(file_path)
        folder_name = os.path.basename(os.path.dirname(file_path))

        # Ensure the destination directory exists
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        # Create the full path for the local file (with folder name prefix if needed)
        dest_file_path = os.path.join(dest_dir, f"{folder_name}_{file_name}")

        # Skip downloading if the file already exists
        if os.path.exists(dest_file_path):
            logging.info(f"⚠️ File {dest_file_path} already exists, skipping...")
            return

        # Write the file to the destination directory
        with open(dest_file_path, 'wb') as f:
            f.write(response.content)
            logging.info(f"✅ Downloaded and copied: {dest_file_path}")
    else:
        logging.error(f"❌ Failed to download {file_path}: {response.status_code}, {response.text}")
        raise ValueError(f"Failed to download {file_path}: {response.status_code}, {response.text}")
