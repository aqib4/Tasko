import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton"; // Import the Skeleton loader
import "react-loading-skeleton/dist/skeleton.css"; // Optional for default styles

const TodoSkeleton = ({ reversedTodos, isLoading, handleUpdateTodo, handleDeleteTodo, startEditing, cancelEditing, saveEditedTodo, editText, setEditText, isUpdating, isDeleting, editingId }) => {
  return (
    <div className="tasks-container">
      {/* Display a skeleton loader if data is loading */}
      {isLoading ? (
        <div className="loading-tasks">
          {/* Repeat Skeleton loaders for multiple tasks */}
          {Array(5)
            .fill()
            .map((_, index) => (
              <div key={index} className="todo-item skeleton">
                <Skeleton width={30} height={30} circle={true} />
                <Skeleton width="80%" height={20} style={{ margin: "0 10px" }} />
                <Skeleton width="40%" height={20} />
              </div>
            ))}
        </div>
      ) : reversedTodos?.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add your first task above!</p>
        </div>
      ) : (
        reversedTodos?.map((todo) => {
          const todoId = todo.id || todo._id;
          const isEditing = editingId === todoId;

          return (
            <div
              key={todoId}
              className={`todo-item ${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`}
            >
              <div className="todo-content">
                {!isEditing && (
                  <span
                    className="todo-checkbox"
                    onClick={() => handleUpdateTodo(todoId, { completed: !todo.completed })}
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
                      onClick={() => saveEditedTodo(todoId)}
                      className="save-button"
                      disabled={isUpdating}
                    >
                      Save
                    </button>
                    <button onClick={cancelEditing} className="cancel-button">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(todo)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleUpdateTodo(todoId, { completed: !todo.completed })}
                      className="status-button"
                      disabled={isUpdating}
                    >
                      {todo.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todoId)}
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
        })
      )}
    </div>
  );
};

export default TodoSkeleton;
