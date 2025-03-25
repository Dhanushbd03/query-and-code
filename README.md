# Query and Code

A full-stack application that allows users to index and semantically search through markdown content using advanced language models and vector search.

## 🚀 Features

- 📝 Markdown file indexing
- 🔍 Semantic search capabilities
- ⚡ Real-time progress tracking
- 🔄 WebSocket-based updates
- 📊 Vector-based document similarity

## 🏗️ Project Structure

```
query-and-code/
├── backend/              # Python Flask backend
│   ├── services/        # Core services (indexing, search)
│   ├── utils/          # Utility functions and configs
│   └── venv/           # Python virtual environment
├── frontend/            # React frontend
│   ├── src/            # Source files
│   └── node_modules/   # Node.js dependencies
└── content/            # Directory for markdown files (gitignored)
```

## 🛠️ Prerequisites

- Python 3.8+
- Node.js 16+
- Hugging Face API key
- Qdrant instance (cloud or local)

## ⚙️ Environment Setup

### Backend Setup

1. Create and activate virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configurations
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configurations
   ```

## 🚀 Running the Application

1. Start the backend server:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:5173`

## 📝 Usage

1. Create a folder in the `content` directory with your markdown files
2. Use the web interface to:
   - Index new content folders
   - Search through indexed content
   - Monitor indexing progress
   - View search results with relevant context

## 🔑 Environment Variables

### Backend (.env)
- `HF_TOKEN` - Hugging Face API token
- `QDRANT_URL` - Qdrant instance URL
- `QDRANT_API_KEY` - Qdrant API key (if using cloud)

### Frontend (.env.local)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_WS_URL` - WebSocket URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request