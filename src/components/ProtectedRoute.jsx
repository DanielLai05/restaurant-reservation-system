// ProtectedRoute.jsx - Route protection based on role
import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { RoleContext } from "../context/RoleContext";

export default function ProtectedRoute({ children, requireAdmin = false, requireStaff = false }) {
  const { userRole } = useContext(RoleContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have stored tokens in localStorage
    const adminToken = localStorage.getItem('adminToken');
    const staffToken = localStorage.getItem('staffToken');
    
    // If we have tokens but userRole is not set, consider it valid temporarily
    if (adminToken || staffToken) {
      // Give time for RoleContext to initialize
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [userRole]);

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Verifying authentication...</p>
      </div>
    );
  }

  // If no role is set and no token, redirect to appropriate login
  if (!userRole) {
    const adminToken = localStorage.getItem('adminToken');
    const staffToken = localStorage.getItem('staffToken');
    
    // We have a token but RoleContext hasn't initialized yet
    // Return children and let the actual page handle the API call
    if (adminToken || staffToken) {
      return children;
    }
    
    // No token at all, redirect to appropriate login page
    if (requireAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    if (requireStaff) {
      return <Navigate to="/staff/login" replace />;
    }
    // Default fallback
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && userRole !== 'admin') {
    // If user is staff, redirect to staff login
    if (userRole === 'staff') {
      return <Navigate to="/staff/dashboard" replace />;
    }
    // Otherwise redirect to admin login (guest user)
    return <Navigate to="/admin/login" replace />;
  }

  // If staff access is required but user is not staff
  if (requireStaff && userRole !== 'staff') {
    // If user is admin, redirect to admin dashboard
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Otherwise redirect to staff login (guest user)
    return <Navigate to="/staff/login" replace />;
  }

  return children;
}
