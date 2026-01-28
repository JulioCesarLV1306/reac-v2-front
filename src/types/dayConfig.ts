// Types para configuración de días especiales

export type DayType = 'normal' | 'feriado' | 'recuperacion';

export interface DayConfig {
  date: string; // formato 'YYYY-MM-DD'
  type: DayType;
  horasRequeridas: number;
  aplicadoA?: string[]; // IDs de usuarios (solo para días de recuperación)
  isGlobal: boolean; // true para feriados (todos los usuarios), false para recuperación
}

export interface DayConfigState {
  days: Record<string, DayConfig>; // key: date string
}

// Horas por defecto según tipo de día
export const DEFAULT_HOURS: Record<DayType, number> = {
  normal: 8,
  recuperacion: 9,
  feriado: 0,
};

// Colores para el calendario
export const DAY_COLORS: Record<DayType, { bg: string; text: string; border: string }> = {
  normal: {
    bg: 'bg-white',
    text: 'text-slate-900',
    border: 'border-slate-200',
  },
  feriado: {
    bg: 'bg-red-100',
    text: 'text-red-900',
    border: 'border-red-300',
  },
  recuperacion: {
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-300',
  },
};
