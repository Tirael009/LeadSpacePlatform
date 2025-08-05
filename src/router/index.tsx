import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import DashboardPublisher from '../pages/DashboardPublisher/DashboardPublisher';
import DashboardLender from '../pages/DashboardLender/DashboardLender';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/publisher" element={<DashboardPublisher />} />
                <Route path="/dashboard/lender" element={<DashboardLender />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;