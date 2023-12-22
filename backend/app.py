from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

todos = [
    {"id": 1, "task": "Buy groceries"},
    {"id": 2, "task": "Work on project"},
    {"id": 3, "task": "Exercise"},
]

# Get all todos
@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

# Get a specific todo by ID
@app.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = next((item for item in todos if item["id"] == todo_id), None)
    if todo:
        return jsonify(todo)
    else:
        return jsonify({"error": "Todo not found"}), 404

# Add a new todo
@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_todo = {"id": len(todos) + 1, "task": data["task"]}
    todos.append(new_todo)
    return jsonify(new_todo), 201

# Update a todo by ID
@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    todo = next((item for item in todos if item["id"] == todo_id), None)
    if todo:
        todo["task"] = data["task"]
        return jsonify(todo)
    else:
        return jsonify({"error": "Todo not found"}), 404

# Delete a todo by ID
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [item for item in todos if item["id"] != todo_id]
    return jsonify({"message": "Todo deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
