import time
from socket_instance import socketio

def emit_log(message: str, type: str = "info"):
    """Emit logs through socket.io"""
    event_data = {
        'message': message,
        'type': type,
        'timestamp': time.time()
    }
    socketio.emit('vectorization_log', event_data, namespace='/')

def emit_status(status: str):
    """Emit status updates"""
    event_data = {
        'status': status,
        'timestamp': time.time()
    }
    socketio.emit('vectorization_status', event_data, namespace='/') 