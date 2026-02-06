import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for token immediately
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  // While checking, show nothing (avoid flash)
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
}
