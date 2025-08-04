import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LenderDashboard from '../pages/lender/Dashboard';
import PublisherDashboard from '../pages/publisher/Dashboard';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/lender/dashboard', element: <LenderDashboard /> },
      { path: '/publisher/dashboard', element: <PublisherDashboard /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;

