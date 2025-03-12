import os
import traceback
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_qdrant import Qdrant
from qdrant_client import QdrantClient
from utils.config import GOOGLE_API_KEY, HF_TOKEN, QDRANT_API_KEY, QDRANT_URL

# Load environment variables
load_dotenv()


class ChatbotService:
    def __init__(self, collection_name):
        """Initialize chatbot components"""
        self.chat_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro-latest",
            google_api_key=GOOGLE_API_KEY,
            retry_max_attempts=3,
            retry_min_delay=2,
            retry_max_delay=20,
        )

        # Initialize embeddings
        self.embedding = HuggingFaceInferenceAPIEmbeddings(api_key=HF_TOKEN)

        # Connect to Qdrant vector database
        self.qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

        # Vectorstore for retrieval
        self.vectorstore = Qdrant(
            client=self.qdrant_client,
            collection_name=collection_name,
            embeddings=self.embedding,
        )

        # Create retriever
        self.retriever = self.vectorstore.as_retriever()

        # Chat history (stores last 10 messages per user)
        self.chat_histories = {}

        # Define prompt template
        self.template = """
You are an AI assistant specialized in answering questions using the provided documentation as the primary source of truth.
You should prioritize and rely on the context given but may use your general knowledge when necessary to enhance the response.
Ensure that your answers are detailed and well-explained.
If the question is about a topic that is not covered in the provided documentation, you can provide insights from your general knowledge while mentioning that the answer is based on external knowledge.
However, if the user asks something completely unrelated or outside your expertise, politely inform them that you can't answer.

---

### Chat History:
{history}

### Context:
{context}

### User Query:
{query}

### Answer:
"""

        self.prompt_template = PromptTemplate.from_template(template=self.template)

    def generate_response(self, user_id: str, query: str):
        """Generate a chatbot response while maintaining history"""
        # Get chat history for this user or initialize an empty list
        history = self.chat_histories.get(user_id, [])

        try:
            if not query.strip():
                raise ValueError("Query cannot be empty")

            print(f"[DEBUG] Generating response for User ID: {user_id}")
            print(f"[DEBUG] Input query: {query}")

            # Format the history as a string
            formatted_history = "\n".join(history)
            print(f"[DEBUG] Current history: {formatted_history}")

            # Get context from retriever
            context_docs = self.retriever.invoke(query)
            context = "\n".join([doc.page_content for doc in context_docs])

            # Prepare inputs for the prompt template
            inputs = {"context": context, "query": query, "history": formatted_history}

            print(f"[DEBUG] Preparing prompt with inputs...")

            # Generate the prompt
            prompt = self.prompt_template.format(**inputs)

            # Generate response using the chat model
            print("[DEBUG] Generating response using chat model...")
            response = self.chat_model.invoke(prompt).content
            print(f"[DEBUG] Response Generated: {response}")

            # Update chat history (limit to last 10 messages)
            history.append(f"User: {query}")
            history.append(f"Bot: {response}")

            # Store only the last 10 messages
            self.chat_histories[user_id] = history[-10:]
            print(f"[DEBUG] Updated chat history: {self.chat_histories[user_id]}")

            return response
        except Exception as e:
            print(f"[ERROR] Exception occurred: {e}")
            print(traceback.format_exc())  # Print full error traceback
            return f"Error generating response: {e}"
