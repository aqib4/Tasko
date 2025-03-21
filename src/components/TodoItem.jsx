import React, { useState } from "react";
import { toast } from "react-toastify";

const TodoItem = ({ 
  todo, 
  onDelete, 
  onUpdate,
  isUpdating,
  isDeleting
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  
  const todoId = todo.id || todo._id;

  // Function to enter edit mode
  const startEditing = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  // Function to save edited text
  const saveEditedTodo = () => {
    if (editText.trim() !== "") {
      onUpdate(todoId, { text: editText });
      setIsEditing(false);
    } else {
      toast.error("Task text cannot be empty!");
    }
  };

  // Handle toggling completed status
  const toggleCompleted = () => {
    onUpdate(todoId, { completed: !todo.completed });
  };

  // Handle deletion
  const handleDelete = () => {
    onDelete(todoId);
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`}>
      <div className="todo-content">
        {!isEditing && (
          <span 
            className="todo-checkbox" 
            onClick={toggleCompleted}
          >
            {todo.completed && <span className="checkmark">✓</span>}
          </span>
        )}
        
        {isEditing ? (
          <input
            type="text"
            className="todo-edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
        ) : (
          <p className="todo-text">{todo.text}</p>
        )}
      </div>
      
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button 
              onClick={saveEditedTodo} 
              className="save-button"
              disabled={isUpdating}
            >
              Save
            </button>
            <button 
              onClick={cancelEditing} 
              className="cancel-button"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={startEditing} 
              className="edit-button"
            >
              Edit
            </button>
            <button 
              onClick={toggleCompleted} 
              className="status-button"
              disabled={isUpdating}
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button 
              onClick={handleDelete} 
              className="delete-button"
              disabled={isDeleting}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;