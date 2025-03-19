import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  useGetTodosQuery, 
  useAddTodoMutation, 
  useDeleteTodoMutation, 
  useUpdateTodoMutation 
} from "../redux/reducers/todo/todoThunk";
import "../styles/todoList.scss";

const TodoList = () => {
  // State to track which todo is being edited
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // With proper cache invalidation, we don't need refetch anymore
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  // Get a reversed copy of the todos array to display newest first
  const reversedTodos = [...todos].reverse();

  const handleAddTodo = async (values, { resetForm }) => {
    try {
      await addTodo({ text: values.newTodo }).unwrap();
      toast.success("Task added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task.");
    }
  };

  const handleUpdateTodo = async (id, changes) => {
    try {
      await updateTodo({ id, ...changes }).unwrap();
      toast.info("Task updated.");
      
      // Reset editing state if we were editing this todo
      if (editingId === id) {
        setEditingId(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id).unwrap();
      toast.warn("Task deleted.");
      
      // Reset editing state if we were editing this todo
      if (editingId === id) {
        setEditingId(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task.");
    }
  };

  // Function to enter edit mode for a todo
  const startEditing = (todo) => {
    setEditingId(todo.id || todo._id);
    setEditText(todo.text);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  // Function to save edited text
  const saveEditedTodo = (id) => {
    if (editText.trim() !== "") {
      handleUpdateTodo(id, { text: editText });
    } else {
      toast.error("Task text cannot be empty!");
    }
  };

  // Show error message if API request failed
  if (error) {
    return <div className="error-container">Error loading tasks: {error.message || "Unknown error"}</div>;
  }

  return (
    <div className="todo-app">
      <div className="todo-container">
        <header className="todo-header">
          <h1>Tasko App</h1>
          <p className="todo-subtitle">Organize your day efficiently</p>
        </header>

        {/* Formik Input Form */}
        <Formik initialValues={{ newTodo: "" }} onSubmit={handleAddTodo}>
          {({ isSubmitting }) => (
            <Form className="todo-form">
              <div className="input-container">
                <Field 
                  type="text" 
                  name="newTodo" 
                  className="todo-input" 
                  placeholder="Add a new task..." 
                  disabled={isAdding}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting || isAdding} 
                  className="add-button"
                >
                  {isAdding ? "Adding..." : "Add Task"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Todo List */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <div className="tasks-container">
            {reversedTodos.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet. Add your first task above!</p>
              </div>
            ) : (
              reversedTodos.map((todo) => {
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
        )}
      </div>
    </div>
  );
};

export default TodoList;