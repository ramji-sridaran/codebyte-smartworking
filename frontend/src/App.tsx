import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { TaskList } from './components/pages/TaskList';
import { TaskForm } from './components/pages/TaskForm';
import './App.css';

function App() {
  return (
    <Router>
      <TaskProvider>
        <div className="app">
          <Routes>
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/:id" element={<TaskForm />} />
            <Route path="/" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </div>
      </TaskProvider>
    </Router>
  );
}

export default App;

