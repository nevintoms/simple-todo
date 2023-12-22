"use client";

import { useState } from 'react';
import Button from '@/components/button/Button';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [todoList, setTodoList] = useState([]);

  const handleAdd = () => {
    if (inputText.trim() !== '') {
      setTodoList([...todoList, inputText]);
      setInputText('');
    }
  };

  const handleEdit = (index) => {
    const updatedText = prompt('Edit item:', todoList[index]);
    if (updatedText !== null) {
      const updatedList = [...todoList];
      updatedList[index] = updatedText;
      setTodoList(updatedList);
    }
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      const updatedList = [...todoList];
      updatedList.splice(index, 1);
      setTodoList(updatedList);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="ml-10">
      <h1 className="text-lg font-bold my-6">TODO</h1>
      <div className="flex">
        <input
          className="text-black rounded-xl"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button text="Add" handleOnClick={handleAdd} />
      </div>
      <div className="pl-5 mt-6">
        <ol className="list-decimal space-y-3 ">
          {todoList.map((item, index) => (
            <li key={index}>
              <div className="flex">
                {item}
                <Button text="Edit" handleOnClick={() => handleEdit(index)} />
                <Button text="Delete" handleOnClick={() => handleDelete(index)} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
