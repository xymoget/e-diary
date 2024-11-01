import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
            path="/student"
            element={
            <PrivateRoute role="student">
                <StudentDashboard />
            </PrivateRoute>
            }
        />
        <Route
            path="/teacher"
            element={
            <PrivateRoute role="teacher">
                <TeacherDashboard />
            </PrivateRoute>
            }
        />
        {/* Add more routes as needed */}
        </Routes>
  );
}

export default App;
