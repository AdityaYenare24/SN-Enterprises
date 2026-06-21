import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/common/PageLoader';

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader label="Checking admin access" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}