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
        You are an AI assistant specialized in answering questions strictly based on the provided documentation.  

        **Guidelines:**  
        - Use only the **context** to answer the question.  
        - If the context does not contain relevant information, respond with:  
        **"I don't have enough information in the provided context to answer this."**  
        - Do not use external knowledge beyond the provided context.  
        - Use the **chat history** to maintain conversation flow but prioritize the latest context.  
        - Keep responses clear, concise, and relevant to the topic.  

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

        # Create RAG pipeline
        set_ret = RunnableParallel(
            {
                "context": self.retriever,
                "query": RunnablePassthrough(),
                "history": RunnablePassthrough(),
            }
        )
        self.rag_chain = (
            set_ret | self.prompt_template | self.chat_model | StrOutputParser()
        )

    def generate_response(self, user_id: str, query: str):
        """Generate a chatbot response while maintaining history"""
        history = self.chat_histories.get(user_id, [])

        try:
            if not query.strip():
                raise ValueError("Query cannot be empty")

            print(f"[DEBUG] Generating response for User ID: {user_id}")

            print(f"[DEBUG] Input to RAG chain: {query}")

            # Generate response using RAG pipeline
            print("[DEBUG] Generating response using RAG pipeline...")
            response = self.rag_chain.invoke(query)
            print(f"[DEBUG] Response Generated: {response}")

            # Update chat history (limit to last 10 messages)
            history.append(f"User: {query}")
            history.append(f"Bot: {response}")
            print(f"[DEBUG]: Chat history: {history}")
            self.chat_histories[user_id] = history[-10:]

            return response
        except Exception as e:
            print(f"[ERROR] Exception occurred: {e}")
            print(traceback.format_exc())  # Print full error traceback
            return f"Error generating response: {e}"
