import os
import datetime
import logging

STATUS = {"running": False, "last_run": None, "folder": None, "logs": None}

def setup_logging():
    """Sets up logging and creates a logs folder with a timestamp."""
    log_dir = f"logs/{datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}"
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "indexing.log")

    logging.basicConfig(
        filename=log_file,
        filemode='w',
        format='%(asctime)s - %(levelname)s - %(message)s',
        level=logging.INFO
    )
    return log_file
