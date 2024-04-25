from flask import Flask, request
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import json
from datetime import datetime
import numpy as np

class Firebase:
    def __init__(self, cred):
        self.app = Flask(__name__)
        CORS(self.app)
        self.default_app = cred
    
    def read_from_DB(self, collection_id, document_id):
        try:
            db = firestore.client()
            doc_ref = db.collection(collection_id).document(document_id)
            doc = doc_ref.get()

            if doc.exists:
                return doc.to_dict()
            else:
                print(f"No such document '{document_id}' in collection '{collection_id}'")
                return None

        except Exception as e:
            print(f"Error: {str(e)}")
            return None
    
    def get_collection(self, collection_id):
        try:
            db = firestore.client()
            docs = db.collection(collection_id).get()
            return [doc.to_dict() for doc in docs]

        except Exception as e:
            print(f"Error: {str(e)}")
            return None
    
    
    def query_by_property(self, collection_id, property_name, property_value):
        try:
            # Get a Firestore client
            db = firestore.client()

            # Query Firestore based on property
            docs = db.collection(collection_id).where(property_name, "==", property_value).get()

            # Return list of documents matching the query
            return [doc.to_dict() for doc in docs]

        except Exception as e:
            print(f"Error: {str(e)}")
            return None

    def query_vectors_by_user(self, collection_id, username):
        try:
            # Get a Firestore client
            db = firestore.client()

            # Query Firestore based on user property
            docs = db.collection(collection_id).where("username", "==", username).get()

            # Extract vectors and texts from documents
            vectors_texts = [
                {
                    "vector": doc.to_dict().get('vector', None),
                    "text": doc.to_dict().get('text', '')
                }
                for doc in docs
            ]
            

            # Filter out documents where vector or text might be missing
            # vectors_texts = [vt for vt in vectors_texts if vt["vector"] is not None and vt["text"]]
            # Filter out documents where vector is missing or empty, or text is missing
            vectors_texts = [vt for vt in vectors_texts if vt["vector"] and vt["text"]]
            
            # print("vectors_texts:", vectors_texts)

            # Find the maximum vector length
            max_vector_length = max(len(vt["vector"]) for vt in vectors_texts)
            
            print("max_vector_length:", max_vector_length)

            # Pad vectors to have the same length
            for vt in vectors_texts:
                # First, ensure that vt["vector"] is indeed a list
                if isinstance(vt["vector"], list):
                    vector_length = len(vt["vector"])
                    if vector_length < max_vector_length:
                        # Calculate the number of zeros needed for padding
                        padding_length = max_vector_length - vector_length
                        # Extend the vector with zeros to match the max_vector_length
                        vt["vector"].extend([0] * padding_length)
                else:
                    # This is a catch-all for debugging, in case vt["vector"] isn't a list as expected
                    print(f"Unexpected type for 'vector': {type(vt['vector'])}. Expected list.")

            return vectors_texts
        except Exception as e:
            print(f"Error: {str(e)}")
            return None



    def create_user_data_file(self, collection_id, property_name, property_value):
        try:
            # Generate timestamp
            timestamp = datetime.now()

            # Construct filename
            filename = f"{property_value}_{timestamp.strftime('%Y%m%d_%H%M%S')}.txt"

            # Get user data based on property
            user_data_list = self.query_by_property(collection_id, property_name, property_value)

            if user_data_list:
                # Extract 'text' field from each document
                texts = [user_data.get('text', '') for user_data in user_data_list]

                # Write consolidated user data to file
                with open(filename, "w") as file:
                    file.write('\n'.join(texts))

                return filename
            else:
                print("No user data found for the given property.")
                return None

        except Exception as e:
            print(f"Error: {str(e)}")
            return None

        
# if __name__ == "__main__":
#     cred = credentials.Certificate("/Users/elviskimara/Downloads/persona AI/personaAI/other/models being tested/Python Web App for testing (flaskapp)/src/personaai-d7d1a-firebase-adminsdk-4578u-a52d9e8d87.json")
#     default_app = firebase_admin.initialize_app(cred)
    
#     firebase = Firebase(default_app)
    
#     # Test read_from_DB
#     document_data = firebase.read_from_DB("users", "dWwEAA9eVQIMAHwO78Wi")
#     if document_data:
#         print("\n\n Document data for read_from_DB:", document_data)
#     else:
#         print("Document not found or error occurred.")

#     # Test get_collection
#     collection_data = firebase.get_collection("users")
#     if collection_data:
#         print("\n\n Collection data for get_collection:")
#         for document in collection_data:
#             print(document)
#     else:
#         print("Collection empty or error occurred.")
    
#     # Test query_by_property
#     #Get all user data by username
#     query_data = firebase.query_vectors_by_user("conversations", "1641935133")
#     if query_data:
#         print("\n\n Query data for query_vectors_by_user:\n\n\n\n", query_data)
#     else:
#         print("No documents found matching the query or error occurred.")

    # Test data
    # collection_id = "conversations"
    # property_name = "username"
    # property_value = "usernamePlaceholder"

    # # Test the function
    # filename = firebase.create_user_data_file(collection_id, property_name, property_value)
    
    # if filename:
    #     try:
    #         with open(filename, "r") as file:
    #             user_data = file.read()
    #             print("Successfully read text data from the file:", user_data)
    #     except FileNotFoundError:
    #         print("Error: File not found.")
    #     except Exception as e:
    #         print("An error occurred while reading the file:", e)
