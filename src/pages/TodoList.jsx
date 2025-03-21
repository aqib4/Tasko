import React from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  useGetTodosQuery, 
  useAddTodoMutation, 
  useDeleteTodoMutation, 
  useUpdateTodoMutation 
} from "../redux/reducers/todo/todoThunk";
import TodoItem from "../components/TodoItem"; // Import the new component
import "../styles/todoList.scss";

const TodoList = () => {
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
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id).unwrap();
      toast.warn("Task deleted.");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task.");
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
              reversedTodos.map((todo) => (
                <TodoItem
                  key={todo.id || todo._id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;