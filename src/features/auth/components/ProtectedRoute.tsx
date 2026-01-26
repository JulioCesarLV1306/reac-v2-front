'use client';

import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 */
export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return fallback ?? <div>Debes iniciar sesión para ver este contenido</div>;
  }

  return <>{children}</>;
};
