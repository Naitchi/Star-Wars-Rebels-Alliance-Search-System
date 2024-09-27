import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Composant pour sécurisé l'application et permettre l'accès que si l'utilisateur a un token sinon redirection to signin

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token: string | null | undefined = getToken();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children};</>;
};

export default ProtectedRoute;
