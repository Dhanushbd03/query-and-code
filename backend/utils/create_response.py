from flask import jsonify, make_response


def create_response(success=False, data=None, message="Something went wrong", status=500):
    """Utility function to create a standardized API response."""
    response_data = {"success": bool(success)}

    if data is not None:
        response_data["data"] = data
    if message is not None:
        response_data["message"] = message

    return make_response(jsonify(response_data), status)
