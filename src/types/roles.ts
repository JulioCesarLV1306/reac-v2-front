/**
 * Tipos para el sistema de roles
 */

export type RoleType = 'trabajador' | 'supervisor' | 'administrador' ;

export type ViewType = 
  | 'activities'      // Vista de actividades del trabajador
  | 'supervisor'      // Vista de supervisión
  | 'reports'         // Vista de reportes
  | 'users'           // Vista de gestión de usuarios
  | 'settings';       // Vista de configuración

export interface Role {
  id: RoleType;
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon?: string;
  allowedViews: ViewType[];
  defaultView?: ViewType;
}

export interface RoleConfig {
  roles: Role[];
  defaultRole: RoleType;
}
