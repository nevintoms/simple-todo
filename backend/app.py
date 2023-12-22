from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(255), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    todos_list = [{'id': todo.id, 'task': todo.task} for todo in todos]
    return jsonify(todos_list)

@app.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if todo:
        return jsonify({'id': todo.id, 'task': todo.task})
    else:
        return jsonify({"error": "Todo not found"}), 404

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_todo = Todo(task=data['task'])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({'id': new_todo.id, 'task': new_todo.task}), 201

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.get_json()
    todo = Todo.query.get(todo_id)
    if todo:
        todo.task = data['task']
        db.session.commit()
        return jsonify({'id': todo.id, 'task': todo.task})
    else:
        return jsonify({"error": "Todo not found"}), 404

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if todo:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo deleted successfully"})
    else:
        return jsonify({"error": "Todo not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)