import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LenderDashboard from '../pages/lender/Dashboard';
import PublisherDashboard from '../pages/publisher/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'lender/dashboard', element: <LenderDashboard /> },
          { path: 'publisher/dashboard', element: <PublisherDashboard /> },
        ],
      },
    ],
  },
]);

export default router;
