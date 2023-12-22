"use client";

import Button from '@/components/button/Button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    // Fetch all todos from Flask backend on component mount
    fetch('http://localhost:5000/todos')
      .then((response) => response.json())
      .then((data) => setTodoList(data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  const handleAdd = () => {
    if (inputText.trim() !== '') {
      // Add a new todo to Flask backend
      fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: inputText }),
      })
        .then((response) => response.json())
        .then((data) => setTodoList([...todoList, data]))
        .catch((error) => console.error('Error adding todo:', error));

      setInputText('');
    }
  };

  const handleEdit = (index, updatedText) => {
    // Update a todo in Flask backend
    fetch(`http://localhost:5000/todos/${todoList[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: updatedText }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedList = [...todoList];
        updatedList[index] = data;
        setTodoList(updatedList);
      })
      .catch((error) => console.error('Error updating todo:', error));
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      const todoId = todoList[index].id;
      // Delete a todo in Flask backend
      fetch(`http://localhost:5000/todos/${todoId}`, {
        method: 'DELETE',
      })
        .then(() => setTodoList(todoList.filter((todo) => todo.id !== todoId)))
        .catch((error) => console.error('Error deleting todo:', error));
    }
  };

  return (
    <div className="ml-10">
      <h1 className="text-lg font-bold my-6">TODO</h1>
      <div className="flex">
        <input
          className="text-black rounded-xl px-2"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button text="Add"
          handleOnClick={handleAdd}
        />
      </div>
      <div className="pl-5 mt-6">
        <ol className="list-decimal">
          {todoList.map((item, index) => (
            <li className="flex" key={item.id}>
              {item.id}. {item.task}
              <Button text="Edit" handleOnClick={() => handleEdit(index, prompt('Edit item:', item.task))} />
              <Button text="Delete" handleOnClick={() => handleDelete(index)} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
