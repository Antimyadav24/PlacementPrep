import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingStates';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoaded, isSignedIn, isAdmin } = useAppAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
