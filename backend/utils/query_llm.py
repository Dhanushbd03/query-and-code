import os
import time
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_qdrant import Qdrant
from qdrant_client import QdrantClient
from google.api_core import exceptions

# Load environment variables
load_dotenv()
google_api_key = os.getenv('GOOGLE_API_KEY')
hf_token = os.getenv('HF_TOKEN')
qdrant_api_key = os.getenv('QDRANT_API_KEY')
qdrant_url = os.getenv('QDRANT_URL')

# Instantiate the LLM (Google Generative AI)
chat = ChatGoogleGenerativeAI(
    model='gemini-1.5-pro-latest',
    google_api_key=google_api_key,
    retry_max_attempts=3,
    retry_min_delay=2,
    retry_max_delay=20
)
# Initialize the HuggingFace Inference API for embeddings
embedding = HuggingFaceInferenceAPIEmbeddings(api_key=hf_token)

# Connect to Qdrant
qdrant_client = QdrantClient(
    url=qdrant_url,
    api_key=qdrant_api_key
)

# Initialize the LangChain Qdrant wrapper
vectorstore = Qdrant(
    client=qdrant_client,
    collection_name="react",  # Change to your relevant collection name
    embeddings=embedding
)

# Setting up the retriever from the vectorstore
retriever = vectorstore.as_retriever()

# Define the prompt template for the assistant
template = '''
You are an expert React developer. Using the provided context, answer the queries 
accordingly and generate relevant code according to the given context to answer the questions.

{context}:
{Question}:

Answer:
'''
prompt_template = PromptTemplate.from_template(template=template)
# Setting up the chain using RunnableParallel and other LangChain components
set_ret = RunnableParallel(
    {"context": retriever, "Question": RunnablePassthrough()}
)
rag_chain = set_ret | prompt_template | chat | StrOutputParser()

# @retry(
#     retry=retry_if_exception_type(exceptions.ResourceExhausted),
#     wait=wait_exponential(multiplier=1, min=4, max=60),
#     stop=stop_after_attempt(3)
# )
def generate_response(text):
    try:
        response = rag_chain.invoke(text)
        return response
    except Exception as e:
        return f"Error generating response: {e}"
