import type { ViewConfig } from '@/types/views';
import type { ViewType } from '@/types/roles';
import { ActivitiesPage, SupervisorPage, AdminPage } from '@/features/time-tracker/components';

/**
 * Configuración de todas las vistas del sistema
 * Para agregar una nueva vista:
 * 1. Agregar el tipo en types/roles.ts
 * 2. Agregar la configuración aquí
 * 3. Asignarla a los roles correspondientes en rolesConfig.ts
 */

export const VIEWS: Record<ViewType, ViewConfig> = {
  activities: {
    id: 'activities',
    name: 'activities',
    displayName: 'Mis Actividades',
    description: 'Gestiona tus actividades diarias',
    component: ActivitiesPage,
    path: '/activities',
  },
  supervisor: {
    id: 'supervisor',
    name: 'supervisor',
    displayName: 'Supervisar',
    description: 'Supervisa las actividades de los usuarios',
    component: SupervisorPage,
    path: '/supervisor',
  },
  reports: {
    id: 'reports',
    name: 'reports',
    displayName: 'Reportes',
    description: 'Genera y visualiza reportes',
    component: () => <div className="p-6">Vista de Reportes - En desarrollo</div>,
    path: '/reports',
  },
  users: {
    id: 'users',
    name: 'users',
    displayName: 'Usuarios',
    description: 'Gestiona los usuarios del sistema',
    component: AdminPage,
    path: '/users',
  },
  settings: {
    id: 'settings',
    name: 'settings',
    displayName: 'Configuración',
    description: 'Configuración del sistema',
    component: () => <div className="p-6">Vista de Configuración - En desarrollo</div>,
    path: '/settings',
  },
};

export const getView = (viewType: ViewType): ViewConfig => {
  return VIEWS[viewType];
};
