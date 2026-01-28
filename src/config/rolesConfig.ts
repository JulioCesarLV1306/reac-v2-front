import type { Role, RoleConfig, RoleType, ViewType } from '@/types/roles';

/**
 * Configuración centralizada de roles y permisos
 * Para agregar un nuevo rol:
 * 1. Agregar el tipo en types/roles.ts
 * 2. Agregar la configuración aquí
 * 3. El sistema se ajustará automáticamente
 */

export const ROLES: Record<RoleType, Role> = {
  trabajador: {
    id: 'trabajador',
    name: 'trabajador',
    displayName: 'Trabajador',
    description: 'Usuario que registra sus propias actividades',
    color: '#a71900',
    allowedViews: ['activities'],
    defaultView: 'activities',
  },
  supervisor: {
    id: 'supervisor',
    name: 'supervisor',
    displayName: 'Supervisor',
    description: 'Supervisa las actividades de los trabajadores',
    color: '#a71900',
    allowedViews: ['supervisor', 'activities', 'reports'],
    defaultView: 'supervisor',
  },
  administrador: {
    id: 'administrador',
    name: 'administrador',
    displayName: 'Administrador / RRHH',
    description: 'Acceso completo al sistema',
    color: '#a71900',
    allowedViews: ['users', 'supervisor', 'activities', 'reports', 'settings'],
    defaultView: 'users',
  },

};

export const ROLE_CONFIG: RoleConfig = {
  roles: Object.values(ROLES),
  defaultRole: 'trabajador',
};

/**
 * Obtener configuración de un rol
 */
export const getRole = (roleType: RoleType): Role => {
  return ROLES[roleType];
};

/**
 * Verificar si un rol tiene acceso a una vista
 */
export const hasViewAccess = (roleType: RoleType, view: ViewType): boolean => {
  const role = ROLES[roleType];
  return role.allowedViews.includes(view);
};

/**
 * Obtener todas las vistas disponibles para un rol
 */
export const getAvailableViews = (roleType: RoleType): ViewType[] => {
  const role = ROLES[roleType];
  return role.allowedViews;
};

/**
 * Obtener la vista por defecto de un rol
 */
export const getDefaultView = (roleType: RoleType): ViewType => {
  const role = ROLES[roleType];
  return role.defaultView || role.allowedViews[0];
};

/**
 * Obtener todos los roles disponibles
 */
export const getAllRoles = (): Role[] => {
  return ROLE_CONFIG.roles;
};
