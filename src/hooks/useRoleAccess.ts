import { useMemo } from 'react';
import type { RoleType, ViewType } from '@/types/roles';
import { hasViewAccess, getAvailableViews, getDefaultView, getRole } from '@/config/rolesConfig';

/**
 * Hook para gestionar el acceso basado en roles
 */
export const useRoleAccess = (currentRole: RoleType) => {
  const roleConfig = useMemo(() => getRole(currentRole), [currentRole]);

  const canAccessView = useMemo(
    () => (view: ViewType) => hasViewAccess(currentRole, view),
    [currentRole]
  );

  const availableViews = useMemo(() => getAvailableViews(currentRole), [currentRole]);

  const defaultView = useMemo(() => getDefaultView(currentRole), [currentRole]);

  return {
    roleConfig,
    canAccessView,
    availableViews,
    defaultView,
  };
};
