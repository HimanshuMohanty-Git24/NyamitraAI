import fitz  # PyMuPDF
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os

# --- IMPORTANT: CONFIGURE THIS SECTION BEFORE RUNNING ---
# You need to run this script 3 times, once for each document type.
#
# --- RUN 1: For IPC Documents ---
PDF_PATH = "asset/IPC.pdf"
FAISS_INDEX_PATH = "faiss_index_ipc"
#
# --- RUN 2: For Legal Precedents (Example) ---
# PDF_PATH = "asset/precedents.pdf"  # <-- Make sure you have this file
# FAISS_INDEX_PATH = "faiss_index_precedence"
#
# --- RUN 3: For Document Creation/Contracts (Example) ---
# PDF_PATH = "asset/contracts.pdf" # <-- Make sure you have this file
# FAISS_INDEX_PATH = "faiss_index_contracts"
# -----------------------------------------------------------


def create_index_from_pdf(pdf_path, index_path):
    """Reads a PDF, creates a FAISS index, and saves it locally."""
    
    if not os.path.exists(pdf_path):
        print(f"❌ ERROR: PDF file not found at '{pdf_path}'. Please check the path.")
        return

    print(f"🚀 Starting index creation for: {pdf_path}")
    print("  - Step 1: Extracting text from PDF...")
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc if page.get_text("text")])
    print("  ✅ Text extraction complete.")

    # Split the text into manageable chunks
    print("  - Step 2: Splitting document into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    print(f"  ✅ Document split into {len(chunks)} chunks.")

    # Initialize the embedding model to convert text to vectors
    print("  - Step 3: Initializing embedding model...")
    embeddings_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    print("  ✅ Embedding model initialized.")

    # Create the FAISS vector store from the document chunks
    print("  - Step 4: Creating FAISS index. This may take a few moments...")
    vector_store = FAISS.from_texts(texts=chunks, embedding=embeddings_model)
    print("  ✅ FAISS index created in memory.")

    # Save the FAISS index to your local disk
    vector_store.save_local(index_path)
    print(f"🎉 Success! Index for '{pdf_path}' saved to local folder: '{index_path}'")


if __name__ == "__main__":
    create_index_from_pdf(PDF_PATH, FAISS_INDEX_PATH)