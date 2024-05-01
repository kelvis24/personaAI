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

class UserInputLogger:
    def __init__(self, username):
        self.file_path = f"app/src/{username}.txt"
        # Check if file does not exist, and touch the file if so
        if not os.path.exists(self.file_path):
            open(self.file_path, 'a').close()  # This will create the file if it doesn't exist

    def append_input(self, user_input):
        """Append input to the user's file."""
        with open(self.file_path, 'a') as file:
            file.write(str(user_input) + "\n")
    
    def retrieve_all_inputs(self):
        """Retrieve all inputs from the user's file."""
        try:
            with open(self.file_path, 'r') as file:
                return file.read()
        except FileNotFoundError:
            return ""  # Return an empty string if the file doesn't exist


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
    REPLICATE_API_TOKEN="r8_AU2bZe1nRL6w3gTzgTODjDEUhpCZeZh0vTmC6"
    replicate.api_token = REPLICATE_API_TOKEN
    
    # Get the input from the request
    userInput = request.args.get('input_string')
    username = request.args.get('username')
    
    # Initialize UserInputLogger for the current user
    user_logger = UserInputLogger(username)
    user_logger.append_input(userInput)  # Log user input
    
    # Use the HuggingFaceEmbedding model to get the vector representation
    query_vector = embed_model.get_text_embedding(userInput)
    
    # Assuming firebase.query_vectors_by_user fetches vectors and texts
    firebase_vectors_texts = firebase.query_vectors_by_user("conversations", username)
    
    # print("Firebase vectors and texts: ", firebase_vectors_texts)
    
    # Exclude entries with empty vectors
    valid_entries = [item for item in firebase_vectors_texts if item["vector"]]
    
    if not valid_entries or firebase_vectors_texts is None:
        print("No valid vector entries found.")
        prompt_template = """
                            Respond to the QUESTION below:
                            - If the QUESTION is a general greeting or an inquiry about personal welfare (e.g., "How are you?" or "Good day"),
                            reply in a friendly and jovial manner. These responses should be warm and engaging.
                            - If the QUESTION is too specific and lacks the necessary context or details for a comprehensive answer,
                            kindly request that the user provide more specific details or context to enable a more accurate response.
                            - If the QUESTION can be answered with general knowledge and the answer is known, provide a generalized,
                            honest, and harmless answer.
                            - If you are unable to answer the QUESTION due to a lack of information, either from the context provided
                            or within general knowledge parameters, clearly state "I DO NOT KNOW".

                            QUESTION:
                            {question}

                            ANSWER:
        """
        
        text_input = prompt_template\
                .replace("{question}", userInput)
        
        output = replicate.run(
            "meta/llama-2-70b-chat",
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
        user_logger.append_input(output)  # Log response
        # Return the response
        return jsonify({"response": "".join(output)})
    
    # Now, `valid_entries` will only contain items with non-empty vectors
    corpus = np.array([item["vector"] for item in valid_entries])
    
    # Convert query_vector to a NumPy array, if it's not already
    query_vector = np.array(query_vector)

    # Calculate cosine similarity
    prod = np.dot(corpus, query_vector)
    norm = np.linalg.norm(corpus, axis=1) * np.linalg.norm(query_vector)
    similarity = prod / norm
    
    all_past_inputs = user_logger.retrieve_all_inputs()
    print("All past inputs: ", all_past_inputs)
    
    prev_query_embedding =  np.array(embed_model.get_text_embedding(all_past_inputs))
    prev_prod = np.dot(query_vector, prev_query_embedding)
    
    
    # Find the indexes of the top 2 vectors
    top_k_indexes = np.argsort(similarity)[-2:]
    
    # Prepare context based on the top 2 vectors
    context_texts = [valid_entries[i]["text"] for i in top_k_indexes]
    context = "\n".join(context_texts)
    
    if prev_prod > 0.83:
        print("prev_prod", prev_prod)
        context = f"PREVIOUS QUERY AND RESPONSE:{all_past_inputs} \n {context}"
        print("Context with previous query and response: ", context)


    # Prepare the prompt
    prompt_template = """
                            Respond to the QUESTION below:
                            - If the QUESTION is a general greeting or an inquiry about welfare (e.g., "How are you?" or "Good day"),
                            reply in a friendly and jovial manner. Do not include the CONTEXT in your response.
                            - If the QUESTION requires specific information from the CONTEXT (provided below) and the answer can 
                            be determined from the CONTEXT, provide that answer.
                            - If the QUESTION pertains to general knowledge or topics not covered in the CONTEXT, such as current events or public information,
                            and if this information is readily available to the model, provide an informed response using general knowledge. 
                            Alternatively, suggest reliable sources where the user can verify the current information (e.g., "You might check the latest sports news outlets for the current heavyweight champion as this information changes frequently.").
                            - If the answer cannot be determined from the CONTEXT, is not within the general knowledge capabilities of the model, or requires updated information that the model cannot access,
                            explicitly state the limitations and respond with "I DO NOT KNOW. The information required to answer your question is not available in the provided context nor within my current dataset. For up-to-date information, please refer to relevant external sources."


                                CONTEXT:
                                {context}

                                QUESTION:
                                {question}

                                ANSWER:

                                """
    
    print("Prompt template: ", prompt_template)
    
      
    text_input = prompt_template.replace("{context}", context)\
            .replace("{question}", userInput)
            
            
            
    output = replicate.run(
            "meta/llama-2-70b-chat",
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

    user_logger.append_input(output)  # Log response
    # Return the response
    return jsonify({"response": "".join(output)})


if __name__ == '__main__':
    app.run(debug=True)
