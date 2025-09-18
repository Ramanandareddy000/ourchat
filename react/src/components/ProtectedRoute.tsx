import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show nothing while checking auth status
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Check if we have a token in localStorage as a secondary check
  const hasToken = localStorage.getItem('authToken');
  
  if (!isAuthenticated && !hasToken) {
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;