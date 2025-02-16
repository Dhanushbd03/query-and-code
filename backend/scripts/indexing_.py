import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader
from langchain_qdrant import Qdrant
from qdrant_client import QdrantClient
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")

# Ensure credentials are loaded
if not HF_TOKEN or not QDRANT_API_KEY or not QDRANT_URL:
    raise ValueError("❌ Missing environment variables. Check .env file!")

# Load Markdown files
data_dir = "content/react"
loader = DirectoryLoader(path=data_dir, glob="**/*.md", show_progress=True)
docs = loader.load()

if not docs:
    raise ValueError("❌ No Markdown files found!")

print(f"📂 Total Markdown Files Found: {len(docs)}")
print("🔍 Sample Document:\n", docs[0].page_content[:500])

# Split documents into smaller chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
texts = text_splitter.split_documents(docs)

print(f"📌 Total Chunks After Splitting: {len(texts)}")
print("🔍 Sample Chunk:\n", texts[0].page_content[:500])

# Initialize embedding model
embedding = HuggingFaceInferenceAPIEmbeddings(api_key=HF_TOKEN)

# Generate sample embedding for validation
sample_text = texts[0].page_content
embedding_vector = embedding.embed_query(sample_text)

if not isinstance(embedding_vector, list) or not all(isinstance(x, float) for x in embedding_vector):
    raise ValueError("❌ Embedding model returned an invalid format!")

print(f"✅ Sample Embedding Vector (First 5 values): {embedding_vector[:5]}")

# Connect to Qdrant
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Delete existing collection if it exists
collection_name = "react"
existing_collections = [c.name for c in client.get_collections().collections]

if collection_name in existing_collections:
    print(f"⚠️ Collection '{collection_name}' exists. Deleting it...")
    client.delete_collection(collection_name)

print(f"✅ Creating new collection '{collection_name}'...")

# Store documents in Qdrant
qdrant = Qdrant.from_documents(
    texts,  # Ensure we use split texts
    embedding,
    url=QDRANT_URL,
    prefer_grpc=True,
    api_key=QDRANT_API_KEY,
    collection_name=collection_name,
)

print("🎉 Indexing completed successfully!")
