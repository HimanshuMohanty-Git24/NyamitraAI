# Legal Chatbot

A specialized AI-powered legal assistant for Indian law that provides information on the Indian Penal Code, legal precedents, and can generate legal documents.

## 🌟 Features

- **IPC Lookup**: Query information about specific sections of the Indian Penal Code
- **Legal Precedent Finder**: Find relevant case laws and precedents
- **Document Generation**: Create legal documents like contracts, affidavits, and notices
- **Translation Service**: Translate legal content to multiple Indian languages

## 🛠️ Technology Stack

### Backend

- **Flask**: Python web framework
- **FAISS**: Vector database for efficient similarity search
- **Sentence Transformers**: For text embeddings
- **Groq**: LLM API integration
- **DuckDuckGo Search**: Real-time web search integration

### Frontend

- **React**: JavaScript library for building the user interface
- **React Router**: For navigation between different features
- **CSS**: Custom styling for a professional appearance

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- Groq API key
- Sarvam AI API key (for translation)

## ⚙️ Installation

### Backend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/Legal_Chatbot.git
   cd Legal_Chatbot
   ```

2. Create a virtual environment

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory with your API keys

   ```env
   GROQ_API_KEY=your_groq_api_key
   ```

5. Start the backend server

   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```bash
   cd frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm start
   ```

## 🚀 Usage

1. **Ask Legal Questions**: Navigate to the "Ask Question" page to query about IPC sections
2. **Find Legal Precedents**: Use the precedent finder to discover relevant case laws
3. **Generate Legal Documents**: Create custom legal documents based on your requirements
4. **Translate**: Translate legal content to multiple Indian languages

## 📦 Project Structure

```text
Legal_Chatbot/
├── app.py                # Main Flask application
├── faiss_index_ipc/      # FAISS index for IPC sections
├── faiss_index_precedence/ # FAISS index for legal precedents
├── faiss_index_contracts/ # FAISS index for contract templates
├── frontend/             # React frontend application
│   ├── public/
│   └── src/
│       ├── components/   # React components
│       └── App.jsx       # Main React component
└── requirements.txt      # Python dependencies
```

## 🔒 Privacy and Security

- All legal queries are processed securely
- No user data is stored permanently
- Web searches are performed anonymously

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/query/ipc` | POST | Query IPC sections |
| `/query/legal` | POST | Query legal precedents |
| `/generate_contract` | POST | Generate legal documents |
| `/translate` | POST | Translate legal content |

## 💡 How It Works

1. **Vector Embeddings**: Legal documents are converted to vector embeddings and stored in FAISS indices
2. **Contextual Search**: User queries retrieve the most relevant legal information from the vector database
3. **Web Augmentation**: Results are enhanced with real-time web search data
4. **LLM Processing**: Groq's LLama 3 70B model processes the information to generate precise, legally accurate responses
5. **Translation**: Sarvam AI's translation API enables multilingual support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For any queries regarding this project, please open an issue or contact [your-email@example.com].