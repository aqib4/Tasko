import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx'; // Ensure correct case
import './App.css';
import Landing from './pages/landing.jsx'; // Ensure correct case
import Login from './pages/login.jsx'; // Ensure correct case
import Signup from './pages/signup.jsx'; // Ensure correct case
import TodoList from './pages/TodoList.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todo" element={<TodoList />} />
      </Routes>
    </Router>
  );
}

export default App;
