import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TEMP: Frontend-only mode – disable all route protection
  // This simply renders children regardless of auth/role so you can finish UI
  return <>{children}</>;
}


