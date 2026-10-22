import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Enforces authentication and role-based access control.
 * Prevents unauthorized privilege escalation.
 */
export const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated, but role does not match required role
  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect to their own dashboard
    const fallbackPath = currentUser.role === 'officer' ? '/officer/dashboard' : '/farmer/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
