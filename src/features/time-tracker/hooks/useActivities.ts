import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityApi } from '../api/activityApi';
import type { ActivityInput, ActivityFilters } from '../types';

// Query keys
const ACTIVITY_KEYS = {
  all: ['activities'] as const,
  lists: () => [...ACTIVITY_KEYS.all, 'list'] as const,
  list: (filters?: ActivityFilters) => [...ACTIVITY_KEYS.lists(), filters] as const,
  detail: (id: string) => [...ACTIVITY_KEYS.all, 'detail', id] as const,
};

/**
 * Hook para obtener todas las actividades
 */
export const useActivities = (filters?: ActivityFilters) => {
  return useQuery({
    queryKey: ACTIVITY_KEYS.list(filters),
    queryFn: () => activityApi.getActivities(filters),
  });
};

/**
 * Hook para obtener una actividad específica
 */
export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ACTIVITY_KEYS.detail(id),
    queryFn: () => activityApi.getActivityById(id),
  });
};

/**
 * Hook para crear una actividad
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ActivityInput) => activityApi.createActivity(input),
    onSuccess: () => {
      // Invalida la lista de actividades para refrescar
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.lists() });
    },
  });
};

/**
 * Hook para actualizar una actividad
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ActivityInput> }) =>
      activityApi.updateActivity(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.lists() });
    },
  });
};

/**
 * Hook para eliminar una actividad
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activityApi.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.lists() });
    },
  });
};
