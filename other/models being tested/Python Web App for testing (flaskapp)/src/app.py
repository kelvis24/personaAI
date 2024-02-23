from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import random
from firebase import Firebase  # Import the Firebase class from firebase.py

def FunctionToReplace(input_string):
    greetings = ["Hello!", "Hi there!", "Greetings!", "Good day!", "my boy", "Hey!"]
    return random.choice(greetings)

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

# Initialize Firebase
firebase = Firebase("/Users/elviskimara/Downloads/new/personaAI/other/models being tested/Python Web App for testing (flaskapp)/src/personaai-d7d1a-firebase-adminsdk-4578u-a52d9e8d87.json")

@app.route('/')
def index():
    return render_template('/index.html')  # You can create an HTML file for the index page if needed

@app.route('/api')
def api():
    # Get the input from the request
    userInput = request.args.get('input_string')
    print(userInput)
    
    # Do something with the input/ function to replace / Load model to do inference then return the result
    result = FunctionToReplace(userInput)
    
    # Call methods from Firebase class
    document_data = firebase.read_from_DB("users", "8QMFyWIBQyI8PPbEmwMy")
    collection_data = firebase.get_collection("users")
    
    ## TODO: Use this to get all user data like this: firebase.query_by_property("conversations", "username", "usernamePlaceholder"
    query_data = firebase.query_by_property("users", "firstName", "elvis")
    
    return jsonify({
        "message": result,
        "document_data": document_data,
        "collection_data": collection_data,
        "query_data": query_data
    })

if __name__ == '__main__':
    app.run(debug=True)
