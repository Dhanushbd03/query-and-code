import requests
import socketio
import time
import json
from datetime import datetime

# Initialize Socket.IO client
sio = socketio.Client()

# API endpoint
API_URL = "http://localhost:5000/vectorization"

@sio.event
def connect():
    print("Connected to server!")

@sio.event
def disconnect():
    print("Disconnected from server!")

@sio.on('vectorization_log')
def on_log(data):
    """Handle real-time logs"""
    timestamp = datetime.fromtimestamp(data['timestamp']).strftime('%H:%M:%S')
    log_type = data['type']
    message = data['message']
    
    # Color coding for different log types
    colors = {
        'info': '\033[94m',  # Blue
        'error': '\033[91m',  # Red
        'warning': '\033[93m',  # Yellow
        'success': '\033[92m'  # Green
    }
    color = colors.get(log_type, '\033[0m')  # Default to no color
    
    print(f"{color}[{timestamp}] {message}\033[0m")

@sio.on('vectorization_status')
def on_status(data):
    """Handle status updates"""
    timestamp = datetime.fromtimestamp(data['timestamp']).strftime('%H:%M:%S')
    print(f"\033[95m[{timestamp}] Status: {data['status']}\033[0m")

def start_indexing(folder_name):
    """Start the indexing process"""
    try:
        # Connect to Socket.IO server
        sio.connect('http://localhost:5000')
        
        # Prepare the request data
        data = {
            "language_id": folder_name
        }
        
        # Send POST request to start indexing
        response = requests.post(API_URL, json=data)
        
        if response.status_code == 202:
            print(f"\033[92m✅ Successfully started indexing for folder: {folder_name}\033[0m")
        else:
            print(f"\033[91m❌ Failed to start indexing: {response.json()}\033[0m")
            
    except Exception as e:
        print(f"\033[91m❌ Error: {str(e)}\033[0m")
    finally:
        # Keep the script running to receive logs
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\033[93m⚠️ Stopping indexing process...\033[0m")
            # Send stop request
            requests.post(f"{API_URL}/stop")
            sio.disconnect()

if __name__ == "__main__":
    # Get folder name from command line argument or use default
    import sys
    folder_name = sys.argv[1] if len(sys.argv) > 1 else "default"
    
    print(f"\033[94m🚀 Starting indexing process for folder: {folder_name}\033[0m")
    start_indexing(folder_name) 