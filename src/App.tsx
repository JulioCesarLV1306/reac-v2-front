'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ActivitiesPage } from '@/features/time-tracker/components';
import { Sidebar } from '@/components/Sidebar';
import styled from 'styled-components';

export function App() {
  const handleNavigate = (role: 'trabajador' | 'supervisor') => {
    console.log('Navegando a:', role);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContainer>
        <Sidebar onNavigate={handleNavigate} />
        <MainContent>
          <ActivitiesPage />
        </MainContent>
      </AppContainer>
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
`;

export default App;
