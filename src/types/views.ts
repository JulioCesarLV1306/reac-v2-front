import type { ComponentType } from 'react';
import type { ViewType } from './roles';

/**
 * Configuración de vistas del sistema
 */

export interface ViewConfig {
  id: ViewType;
  name: string;
  displayName: string;
  description: string;
  component: ComponentType;
  path: string;
}
