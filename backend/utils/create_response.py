from flask import jsonify, make_response

def create_response(success, data=None, message=None, status=200):
    """Utility function to create a standardized API response."""
    response_data = {"success": success}
    
    if data:
        response_data["data"] = data
    if message:
        response_data["message"] = message

    return make_response(jsonify(response_data), status)