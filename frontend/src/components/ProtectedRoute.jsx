import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Protects routes that require a logged-in user or an admin
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-20 text-gray-700 dark:text-gray-300">Loading...</div>;
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Requires admin but user is not admin -> Redirect to home/events
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/events" replace />;
  }

  return children;
};

export default ProtectedRoute;
