import os
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_and_split_documents(data_dir, chunk_size=500, chunk_overlap=50):
    """Load markdown documents from a directory and split them into chunks."""
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Directory '{data_dir}' not found!")

    loader = DirectoryLoader(path=data_dir, glob="**/*.md", show_progress=True)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    split_texts = text_splitter.split_documents(docs)

    return split_texts
