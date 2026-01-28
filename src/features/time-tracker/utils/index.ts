import type { Activity } from '../types';
import { formatDate, formatTime, calculateHoursDifference, formatHours } from '@/utils/dateUtils';

export * from './timeValidation';

/**
 * Formatea una actividad para mostrar
 */
export const formatActivityForDisplay = (activity: Activity) => {
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);
  const hours = calculateHoursDifference(startDate, endDate);

  return {
    ...activity,
    startDate,
    endDate,
    formattedDate: formatDate(startDate),
    formattedStartTime: formatTime(startDate),
    formattedEndTime: formatTime(endDate),
    formattedDuration: formatHours(hours),
  };
};

/**
 * Agrupa actividades por fecha
 */
export const groupActivitiesByDate = (activities: Activity[]) => {
  const grouped: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const date = formatDate(activity.startDate);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });

  return grouped;
};
