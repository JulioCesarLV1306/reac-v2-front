import { useMemo } from 'react';
import type { Activity } from '../types';
import { calculateHoursDifference, formatHours } from '@/utils/dateUtils';

/**
 * Hook para calcular estadísticas de actividades
 */
export const useActivityStats = (activities: Activity[] | undefined) => {
  return useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        totalHours: 0,
        totalActivities: 0,
        completedActivities: 0,
        pendingActivities: 0,
        formattedHours: '0h 0m',
      };
    }

    let totalHours = 0;
    activities.forEach((activity) => {
      const hours = calculateHoursDifference(
        new Date(activity.startDate),
        new Date(activity.endDate)
      );
      totalHours += hours;
    });

    return {
      totalHours,
      totalActivities: activities.length,
      completedActivities: activities.filter((a) => a.status === 'Completada').length,
      pendingActivities: activities.filter((a) => a.status === 'Pendiente').length,
      formattedHours: formatHours(totalHours),
    };
  }, [activities]);
};
