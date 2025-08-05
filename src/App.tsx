import React from 'react';
import AppRouter from './router';
import AuthProvider from './context/AuthProvider';
import './styles/main.scss';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
};

export default App;