'use client';

import { useState, useMemo, lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import styled from 'styled-components';
import type { RoleType, ViewType } from '@/types/roles';
import { getDefaultView } from '@/config/rolesConfig';
import { getView } from '@/config/viewsConfig';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/features/auth/hooks';

// Lazy loading de componentes pesados
const Sidebar = lazy(() => import('@/components/Sidebar').then(m => ({ default: m.Sidebar })));
const LoginForm = lazy(() => import('@/features/auth/components').then(m => ({ default: m.LoginForm })));

// Componente interno que usa los hooks
function AppContent() {
  const { isAuthenticated, user } = useAuthStore();
  const [currentRole, setCurrentRole] = useState<RoleType>('supervisor');
  const [currentView, setCurrentView] = useState<ViewType>(() => getDefaultView('supervisor'));
  const logout = useLogout();

  useRoleAccess(currentRole);

  const handleRoleChange = (role: RoleType) => {
    setCurrentRole(role);
    const newDefaultView = getDefaultView(role);
    setCurrentView(newDefaultView);
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  const CurrentViewComponent = useMemo(() => {
    const viewConfig = getView(currentView);
    return viewConfig.component;
  }, [currentView]);

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingScreen>Cargando...</LoadingScreen>}>
        <LoginForm />
      </Suspense>
    );
  }

  // Si está autenticado, mostrar la aplicación
  return (
    <Suspense fallback={<LoadingScreen>Cargando...</LoadingScreen>}>
      <AppContainer>
        <Sidebar 
          onNavigate={handleRoleChange} 
          initialRole={currentRole}
          onLogout={handleLogout}
          userName={user?.name}
          userRole={user?.role === 'admin' ? 'Administrador' : 'Trabajador'}
        />
        <MainContent>
          <Suspense fallback={<ViewLoading>Cargando vista...</ViewLoading>}>
            <CurrentViewComponent />
          </Suspense>
        </MainContent>
      </AppContainer>
    </Suspense>
  );
}

// Componente principal que provee el contexto
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
  position: relative;
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const ViewLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  color: #999;
`;

export default App;
