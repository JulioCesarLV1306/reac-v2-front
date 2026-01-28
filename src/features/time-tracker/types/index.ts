/**
 * Tipos para la funcionalidad de time tracker
 */

export interface Activity {
  endTime: any;
  startTime: any;
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'Pendiente' | 'Completada' | 'Cancelada';
  userId?: string;
}

export interface ActivityInput {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface ActivityFilters {
  date?: Date;
  status?: Activity['status'];
}

export interface DailyActivitySummary {
  date: Date;
  totalHours: number;
  activities: Activity[];
}
