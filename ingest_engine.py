import os
import json
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.gemini import GeminiEmbedding
from llama_index.core.settings import Settings

def main():
    print("Initializing ingestion engine...")
    input_dir = "loop_exports"
    output_path = "public/datacenter/loop_ingested.json"
    
    if not os.path.exists(input_dir):
        os.makedirs(input_dir, exist_ok=True)
    
    # Load documents
    print(f"Loading documents from {input_dir}...")
    reader = SimpleDirectoryReader(input_dir, recursive=True)
    documents = reader.load_data()
    
    if not documents:
        print("No documents found. Please add files to loop_exports/.")
        with open(output_path, "w") as f:
            json.dump([], f)
        return
        
    # Parse nodes
    print("Parsing documents into nodes...")
    # strict constraint: maintain cross-references to T-IDs or P-IDs present in text
    parser = SentenceSplitter(chunk_size=1024, chunk_overlap=200)
    nodes = parser.get_nodes_from_documents(documents)
    
    print(f"Generated {len(nodes)} chunks. Extracting embeddings...")
    
    api_key = os.environ.get("GEMINI_API_KEY", "dummy_key")
    embed_model = GeminiEmbedding(model_name="models/embedding-001", api_key=api_key)
    
    # Extract texts
    texts = [node.get_content() for node in nodes]
    
    try:
        if api_key != "dummy_key":
            embeddings = embed_model.get_text_embedding_batch(texts)
        else:
            raise ValueError("No GEMINI_API_KEY provided.")
    except Exception as e:
        print(f"Note: Embedding extraction bypassed due to API key error ({e}). Using zeroes for now.")
        embeddings = [[0.0] * 768 for _ in texts]
        
    print("Serializing JSON payload...")
    payload = []
    for i, node in enumerate(nodes):
        payload.append({
            "id": node.node_id,
            "text": node.get_content(),
            "metadata": node.metadata,
            "embedding": embeddings[i]
        })
        
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully processed {len(nodes)} nodes. Output saved to {output_path}")

if __name__ == "__main__":
    main()
