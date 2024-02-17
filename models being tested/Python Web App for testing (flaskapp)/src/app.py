from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import random

def FunctionToReplace(input_string):
    greetings = ["Hello!", "Hi there!", "Greetings!", "Good day!", "my boy", "Hey!"]
    return random.choice(greetings)

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app


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
    
    # model = YOLO("app/src/ppe.pt")
    return jsonify({"message": result})

if __name__ == '__main__':
    app.run(debug=True)


