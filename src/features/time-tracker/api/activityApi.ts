import type { Activity, ActivityInput, ActivityFilters } from '../types';

/**
 * Simulación de API para actividades
 * En producción, esto iría a un backend real con axios
 */

// Mock data
const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Reunión de equipo',
    description: 'Aqui el usuario debe indicar la actividad que ha realizado',
    startDate: new Date('2026-01-01T09:34:00'),
    endDate: new Date('2026-01-01T13:27:00'),
    startTime: new Date('2026-01-01T09:34:00'),
    endTime: new Date('2026-01-01T13:27:00'),
    status: 'Pendiente',
  },
];

export const activityApi = {
  /**
   * Obtiene todas las actividades del usuario
   */
  getActivities: async (filters?: ActivityFilters): Promise<Activity[]> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = mockActivities;

    if (filters?.date) {
      filtered = filtered.filter((activity) => {
        const actDate = new Date(activity.startDate);
        const filterDate = new Date(filters.date!);
        return (
          actDate.getDate() === filterDate.getDate() &&
          actDate.getMonth() === filterDate.getMonth() &&
          actDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    if (filters?.status) {
      filtered = filtered.filter((activity) => activity.status === filters.status);
    }

    return filtered;
  },

  /**
   * Obtiene una actividad por ID
   */
  getActivityById: async (id: string): Promise<Activity | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockActivities.find((activity) => activity.id === id) || null;
  },

  /**
   * Crea una nueva actividad
   */
  createActivity: async (input: ActivityInput): Promise<Activity> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newActivity: Activity = {

      id: String(mockActivities.length + 1),
      ...input,
        startTime: input.startDate,
        endTime: input.endDate,
      status: 'Pendiente',
    };

    mockActivities.push(newActivity);
    return newActivity;
  },

  /**
   * Actualiza una actividad existente
   */
  updateActivity: async (id: string, input: Partial<ActivityInput>): Promise<Activity | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const activity = mockActivities.find((act) => act.id === id);
    if (!activity) return null;

    Object.assign(activity, input);
    return activity;
  },

  /**
   * Elimina una actividad
   */
  deleteActivity: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockActivities.findIndex((act) => act.id === id);
    if (index === -1) return false;

    mockActivities.splice(index, 1);
    return true;
  },
};
