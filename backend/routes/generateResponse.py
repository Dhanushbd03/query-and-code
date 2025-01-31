# from flask import Blueprint, request, jsonify
# from utils.query_llm import generate_response
# generateResponse = Blueprint('generateResponse', __name__)

# @generateResponse.route('/generate', methods=['POST'])
# def generate():
#     query = request.json.get('query')
#     app.logger.info(f"Query: {query}")
#     result = generate_response(query)
#     return jsonify(result) 