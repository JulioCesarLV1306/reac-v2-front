import type { Activity } from '../types';

/**
 * Convierte una hora en formato HH:mm a minutos desde medianoche
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convierte minutos a formato HH:mm
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Verifica si dos rangos de tiempo se solapan
 */
export const timeRangesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  // Un rango solapa con otro si:
  // - El inicio del rango 1 está entre el inicio y fin del rango 2
  // - El fin del rango 1 está entre el inicio y fin del rango 2
  // - El rango 1 contiene completamente al rango 2
  return (
    (start1Min >= start2Min && start1Min < end2Min) ||
    (end1Min > start2Min && end1Min <= end2Min) ||
    (start1Min <= start2Min && end1Min >= end2Min)
  );
};

/**
 * Obtiene las horas ocupadas del día a partir de las actividades
 */
export const getOccupiedTimeRanges = (activities: Activity[]): Array<{ start: string; end: string }> => {
  return activities.map(activity => {
    const startDate = new Date(activity.startDate);
    const endDate = new Date(activity.endDate);
    
    return {
      start: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
      end: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
    };
  });
};

/**
 * Valida si un nuevo rango de tiempo se solapa con actividades existentes
 */
export const validateTimeRange = (
  startTime: string,
  endTime: string,
  existingActivities: Activity[]
): { isValid: boolean; conflictingActivity?: Activity } => {
  const occupiedRanges = getOccupiedTimeRanges(existingActivities);

  for (let i = 0; i < occupiedRanges.length; i++) {
    const range = occupiedRanges[i];
    if (timeRangesOverlap(startTime, endTime, range.start, range.end)) {
      return {
        isValid: false,
        conflictingActivity: existingActivities[i],
      };
    }
  }

  return { isValid: true };
};

/**
 * Calcula el total de horas trabajadas en un día
 */
export const calculateTotalHours = (activities: Activity[]): number => {
  const totalMinutes = activities.reduce((total, activity) => {
    const start = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return total + diff;
  }, 0);

  return totalMinutes / 60;
};

/**
 * Calcula las horas disponibles restantes
 */
export const getRemainingHours = (
  activities: Activity[],
  requiredHours: number
): number => {
  const totalHours = calculateTotalHours(activities);
  return Math.max(0, requiredHours - totalHours);
};

/**
 * Obtiene sugerencias de horarios disponibles
 */
export const getSuggestedTimeSlots = (
  activities: Activity[],
  duration: number = 60 // duración en minutos
): Array<{ start: string; end: string }> => {
  const occupiedRanges = getOccupiedTimeRanges(activities)
    .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

  const suggestions: Array<{ start: string; end: string }> = [];
  
  // Hora de inicio laboral: 8:00 AM
  let currentTime = 8 * 60;
  const endOfDay = 18 * 60; // 6:00 PM

  for (const range of occupiedRanges) {
    const rangeStart = timeToMinutes(range.start);
    
    // Si hay espacio antes de esta actividad
    if (currentTime + duration <= rangeStart) {
      suggestions.push({
        start: minutesToTime(currentTime),
        end: minutesToTime(currentTime + duration),
      });
    }
    
    currentTime = Math.max(currentTime, timeToMinutes(range.end));
  }

  // Agregar sugerencia después de la última actividad
  if (currentTime + duration <= endOfDay) {
    suggestions.push({
      start: minutesToTime(currentTime),
      end: minutesToTime(currentTime + duration),
    });
  }

  return suggestions.slice(0, 3); // Máximo 3 sugerencias
};
