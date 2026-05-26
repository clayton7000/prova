import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; // Certifique-se de que o caminho até o AuthService está correto

const ProtectedRoute = ({ children }) => {
    if (!AuthService.isAuthenticated()) {
        // Se não houver token no localStorage, barra o usuário e joga pro login
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;