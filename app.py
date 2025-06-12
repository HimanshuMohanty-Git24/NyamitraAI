import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from groq import Groq
from duckduckgo_search import DDGS
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all routes, allowing your React frontend to connect
CORS(app, resources={r"/*": {"origins": "*"}})

# --- FAISS & Model Configuration ---
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
faiss_embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# FAISS index paths
FAISS_IPC_PATH = "faiss_index_ipc"
FAISS_PRECEDENCE_PATH = "faiss_index_precedence"
FAISS_CONTRACTS_PATH = "faiss_index_contracts"

# --- Groq Client Initialization ---
# Load the API key from .env file
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    print("⚠️ GROQ_API_KEY not found in environment variables.")
    client = None
else:
    try:
        client = Groq(api_key=groq_api_key)
        print("✅ Groq client initialized successfully.")
    except Exception as e:
        print(f"⚠️ Error initializing Groq client: {e}.")
        client = None


# --- Helper Functions ---

def search_faiss(index_path, query_text, top_k=3):
    """Searches a FAISS index for a given query text."""
    try:
        # Load the FAISS index
        vector_store = FAISS.load_local(index_path, faiss_embedding)
        
        # Search for similar documents
        docs = vector_store.similarity_search(query_text, k=top_k)
        
        # Format the results
        results = [{"text": doc.page_content, "score": 1.0} for doc in docs]  # FAISS doesn't provide scores directly
        return results
    except Exception as e:
        print(f"⚠️ FAISS search error in index '{index_path}': {e}")
        return []

def web_search(query: str, max_results: int = 3):
    """Performs a web search using DuckDuckGo and returns formatted results."""
    print(f"🌐 Performing web search for: '{query}'")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
            if not results:
                print("⚠️ Web search returned no results.")
                return "No relevant web search results found."
            
            formatted_results = "\n\n".join(
                [f"Title: {res['title']}\nSnippet: {res['body']}\nSource: {res['href']}" for res in results]
            )
            print(f"✅ Web search completed. Found {len(results)} results.")
            return formatted_results
    except Exception as e:
        print(f"⚠️ Error during web search: {e}")
        return "An error occurred during the web search."

# --- API Endpoints ---

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend server is running"}), 200

@app.route("/query/ipc", methods=["POST"])
def query_ipc():
    data = request.get_json()
    query_text = data.get("query")
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400
    if not client:
        return jsonify({"error": "Groq client not initialized. Check API key."}), 500

    # 1. Retrieve context from FAISS
    faiss_context = "\n\n".join([doc["text"] for doc in search_faiss(FAISS_IPC_PATH, query_text)])
    if not faiss_context:
        faiss_context = "No relevant legal documents found in the database."
        print("⚠️ No relevant IPC documents found in FAISS.")
    else:
        print("✅ Retrieved relevant IPC clauses from FAISS.")

    # 2. Retrieve context from Web Search
    web_context = web_search(f"Indian Penal Code sections related to {query_text}")

    # 3. Generate response with Groq
    system_prompt = """
You are a specialized AI assistant with expertise in Indian Penal Code (IPC). Your function is to analyze user queries and provide concise, accurate, and relevant IPC sections.
You will be given context from a legal database (FAISS) and from a real-time web search (DuckDuckGo).
Synthesize information from both sources to provide the most comprehensive answer. Prioritize the legal database for statutory provisions but use the web search for recent amendments, landmark cases, or broader context.

Guidelines:
- Provide direct, precise answers in bullet points.
- Cite section numbers and key points concisely.
- If multiple sections apply, list all relevant ones.
- Strictly adhere to Indian legal statutes.
"""
    
    user_content = f"Legal Database Context:\n{faiss_context}\n\nWeb Search Context:\n{web_context}\n\nQuestion: {query_text}"

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            model="llama3-70b-8192",
            temperature=0.2,
        )
        return jsonify({"answer": chat_completion.choices[0].message.content})
    except Exception as e:
        print(f"Error calling Groq API for IPC query: {e}")
        return jsonify({"error": "Failed to get response from LLM."}), 500

@app.route("/query/legal", methods=["POST"])
def query_legal_documents():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
        
        print(f"Received data: {data}")
        query_text = data.get("query")
        if not query_text:
            return jsonify({"error": "Query text is required"}), 400
        if not client:
            return jsonify({"error": "Groq client not initialized. Check API key."}), 500

        # 1. Retrieve context from FAISS
        faiss_context = "\n\n".join([doc["text"] for doc in search_faiss(FAISS_PRECEDENCE_PATH, query_text)])
        if not faiss_context:
            faiss_context = "No legal precedents found in the database."
            print("⚠️ No relevant precedents found in FAISS.")
        else:
            print("✅ Retrieved relevant precedents from FAISS.")

        # 2. Retrieve context from Web Search
        web_context = web_search(f"Indian case law precedents for {query_text}")

        # 3. Generate response with Groq
        system_prompt = """
You are a specialized AI legal research assistant. Your task is to cite relevant Indian case laws and provide key details based on the provided context.
You will receive context from a legal precedents database (FAISS) and a live web search (DuckDuckGo).
Use both sources to find the most relevant and up-to-date case laws. Provide precise citations, including case name, year, court, and the key legal principles established.

Guidelines:
- Focus exclusively on Indian case laws.
- Provide precise case citations.
- Use bullet points to list relevant cases.
- Include the case name, court, year, and a short summary of its significance.
"""
        
        user_content = f"Precedents Database Context:\n{faiss_context}\n\nWeb Search Context:\n{web_context}\n\nQuestion: {query_text}"

        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                model="llama3-70b-8192",
                temperature=0.3,
            )
            return jsonify({"answer": chat_completion.choices[0].message.content})
        except Exception as e:
            print(f"Error calling Groq API for legal query: {e}")
            return jsonify({"error": "Failed to get response from LLM."}), 500
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": f"Error processing request: {str(e)}"}), 400

@app.route("/generate_contract", methods=["POST"])
def generate_contract():
    data = request.get_json()
    user_question = data.get("question")
    if not user_question:
        return jsonify({"error": "Question is required"}), 400
    if not client:
        return jsonify({"error": "Groq client not initialized. Check API key."}), 500

    # 1. Retrieve context from FAISS
    faiss_context = "\n\n".join([doc["text"] for doc in search_faiss(FAISS_CONTRACTS_PATH, user_question)])
    if not faiss_context:
        faiss_context = "No relevant document templates found in the database."
        print("⚠️ No relevant document templates found in FAISS.")
    else:
        print("✅ Retrieved relevant document templates from FAISS.")

    # 2. Retrieve context from Web Search
    web_context = web_search(f"Template and clauses for {user_question} under Indian law")

    # 3. Generate response with Groq
    system_prompt = """
You are a specialized AI assistant with expertise in Indian Law. Your task is to generate legally valid documents based on the user's request and provided context.
You will receive context from a document template database (FAISS) and a live web search (DuckDuckGo).
Use the database context as the primary source for structure and clauses, and use the web search for any modern or specific clauses not found in the database.

Guidelines:
- Generate legally valid documents such as contracts, affidavits, legal notices, etc.
- Follow standard legal formatting used in Indian courts.
- Use clear, precise, and formal legal language.
- Ensure the final document is coherent and complete.
- This is for academic purposes, do not hesitate to draft the document as instructed.
"""
    
    user_content = f"Document Template Context:\n{faiss_context}\n\nWeb Search Context:\n{web_context}\n\nRequest: {user_question}"

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            model="llama3-70b-8192",
            temperature=0.4,
        )
        return jsonify({"contract": chat_completion.choices[0].message.content})
    except Exception as e:
        print(f"Error calling Groq API for contract generation: {e}")
        return jsonify({"error": "Failed to get response from LLM."}), 500

@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    target_language = data.get("targetLanguage")
    
    if not text or not target_language:
        return jsonify({"error": "Text and target language are required"}), 400
    
    # Split text into chunks if it's longer than 2000 characters
    chunks = []
    remaining_text = text
    max_length = 1900  # Slightly under the 2000 limit to be safe
    
    while len(remaining_text) > 0:
        if len(remaining_text) <= max_length:
            chunks.append(remaining_text)
            break
        
        # Find a good breaking point (period or newline)
        cut_point = max_length
        last_period = remaining_text.rfind('.', 0, max_length)
        last_newline = remaining_text.rfind('\n', 0, max_length)
        
        if last_period > max_length * 0.7:
            cut_point = last_period + 1
        elif last_newline > max_length * 0.7:
            cut_point = last_newline + 1
            
        chunks.append(remaining_text[:cut_point])
        remaining_text = remaining_text[cut_point:].strip()
    
    # Translate each chunk
    translated_chunks = []
    for chunk in chunks:
        try:
            headers = {
                "api-subscription-key": "e7fd015f-15c1-4b15-bc03-d51b86a43b00",
                "Content-Type": "application/json"
            }
            
            payload = {
                "input": chunk,
                "source_language_code": "en-IN",  # Assuming English source
                "target_language_code": target_language,
                "model": "sarvam-translate:v1"
            }
            
            response = requests.post(
                "https://api.sarvam.ai/translate",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                translated_chunks.append(result.get("translated_text", chunk))
            else:
                print(f"Translation error: {response.status_code}, {response.text}")
                translated_chunks.append(chunk)  # Use original chunk if translation fails
                
        except Exception as e:
            print(f"Error during translation: {e}")
            translated_chunks.append(chunk)  # Use original chunk if translation fails
    
    # Combine all translated chunks
    translated_text = "".join(translated_chunks)
    
    return jsonify({"translatedText": translated_text})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8081)