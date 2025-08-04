import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout'; // поменяли импорт
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LenderDashboard from './pages/lender/Dashboard';
import PublisherDashboard from './pages/publisher/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Добавлен редирект, если маршрут "/" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищённые роуты */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/lender/dashboard" element={<LenderDashboard />} />
            <Route path="/publisher/dashboard" element={<PublisherDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;