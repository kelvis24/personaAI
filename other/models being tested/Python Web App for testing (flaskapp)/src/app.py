from firebase import Firebase  # Import the Firebase class from firebase.py
from firebase_admin import credentials, firestore
import firebase_admin
import replicate
from dotenv import load_dotenv
import os
load_dotenv()

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import numpy as np

# Initialize your embedding model
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en")

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

cred = credentials.Certificate("app/src/personaai-d7d1a-firebase-adminsdk-4578u-a52d9e8d87.json")
default_app = firebase_admin.initialize_app(cred)
firebase = Firebase(default_app)
    
@app.route('/')
def index():
    return render_template('/index.html')  # Assuming you have an index.html

@app.route('/api')
def api():
    # Get the input from the request
    userInput = request.args.get('input_string')
    print(userInput)
    
    # Use the HuggingFaceEmbedding model to get the vector representation
    result_vector = embed_model.get_text_embedding(userInput)
    
    # Return the vector as a JSON response. Note: You might need to convert it to a list if it's not already.
    return jsonify({"vector": result_vector})


@app.route('/query')
def query():
    # Get the input from the request
    userInput = request.args.get('input_string')
    username = request.args.get('username')
    print(userInput)
    
    # Use the HuggingFaceEmbedding model to get the vector representation
    query_vector = embed_model.get_text_embedding(userInput)
    
    # Assuming firebase.query_vectors_by_user fetches vectors and texts
    firebase_vectors_texts = firebase.query_vectors_by_user("conversations", username)
    
    print("Firebase vectors and texts: ", firebase_vectors_texts)
    
    # Exclude entries with empty vectors
    valid_entries = [item for item in firebase_vectors_texts if item["vector"]]
    
    if not valid_entries:
        print("No valid vector entries found.")
        return jsonify({"error": "No valid vector entries found"})
    
    # Now, `valid_entries` will only contain items with non-empty vectors
    corpus = np.array([item["vector"] for item in valid_entries])
    
    # Convert query_vector to a NumPy array, if it's not already
    query_vector = np.array(query_vector)

    # Calculate cosine similarity
    prod = np.dot(corpus, query_vector)
    norm = np.linalg.norm(corpus, axis=1) * np.linalg.norm(query_vector)
    similarity = prod / norm
    
    # Find the indexes of the top 2 vectors
    top_k_indexes = np.argsort(similarity)[-2:]
    
    # Prepare context based on the top 2 vectors
    context_texts = [valid_entries[i]["text"] for i in top_k_indexes]
    context = "\n".join(context_texts)
    
    # Prepare the prompt
    prompt_template = f"""Answer the following question based on the context given. If you do not know the answer and the context doesn't contain the answer truthfully and return "I DO NOT KNOW".

CONTEXT:
{context}

QUESTION:
{userInput}

ANSWER:
    """
    
    print("Prompt template: ", prompt_template)
    
    REPLICATE_API_TOKEN="r8_AU2bZe1nRL6w3gTzgTODjDEUhpCZeZh0vTmC6"
    
    replicate.api_token = REPLICATE_API_TOKEN
      
    text_input = prompt_template.replace("{context}", context)\
            .replace("{question}", userInput)
            
            
            
    output = replicate.run(
            "meta/llama-2-13b-chat",
            input={
                "debug": False,
                "top_k": -1,
                "top_p": 1,
                "prompt": text_input,
                "temperature": 0.05,
                "system_prompt": "You are a helpful and truthful assistant, answer only if you know the answer. If you do not know the answer, truthfully say 'I do not know'.",
                "max_new_tokens": 800,
                "min_new_tokens": -1,
                "repetition_penalty": 1
            }
        )

    # print("".join(output))
    
    # Return the response
    return jsonify({"response": "".join(output)})


if __name__ == '__main__':
    app.run(debug=True)
