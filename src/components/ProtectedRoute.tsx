import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, send to login preserving intended route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // While authenticated but user/role not ready yet, render nothing
  if (!user) return null;

  // If role is not allowed, redirect to the user's dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const target = user.role === 'admin' ? '/admin' : user.role === 'marketer' ? '/marketer' : '/sales';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

