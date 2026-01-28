import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayConfig, DayType } from '@/types/dayConfig';

interface DayConfigStore {
  days: Record<string, DayConfig>;
  setDayConfig: (date: string, type: DayType, userIds: string[]) => void;
  setDayConfigRange: (startDate: string, endDate: string, type: DayType, userIds: string[]) => void;
  getDayConfig: (date: string) => DayConfig | null;
  getDayConfigForUser: (date: string, userId: string) => DayConfig | null;
  getHoursForUser: (date: string, userId: string) => number;
  removeDayConfig: (date: string) => void;
  removeDayConfigRange: (startDate: string, endDate: string) => void;
  getHoursForDay: (date: string) => number;
  clearAllDays: () => void;
  hasRecoveryForUser: (date: string, userId: string) => boolean;
}

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

// Genera array de fechas entre dos fechas (inclusive)
const getDateRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  // Asegurar que start <= end
  if (startDate > endDate) return dates;
  
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export const useDayConfigStore = create<DayConfigStore>()(
  persist(
    (set, get) => ({
      days: {},

      setDayConfig: (date: string, type: DayType, userIds: string[]) => {
        const formattedDate = formatDate(date);
        const horasRequeridas = type === 'normal' ? 8 : type === 'recuperacion' ? 9 : 0;
        
        // Feriados son globales, recuperación es por usuario
        const isGlobal = type === 'feriado';

        set((state) => {
          const existingConfig = state.days[formattedDate];
          
          // Si ya existe configuración de recuperación, mergear usuarios
          if (existingConfig && existingConfig.type === 'recuperacion' && type === 'recuperacion') {
            const existingUsers = existingConfig.aplicadoA || [];
            const mergedUsers = [...new Set([...existingUsers, ...userIds])];
            
            return {
              days: {
                ...state.days,
                [formattedDate]: {
                  ...existingConfig,
                  aplicadoA: mergedUsers,
                },
              },
            };
          }

          return {
            days: {
              ...state.days,
              [formattedDate]: {
                date: formattedDate,
                type,
                horasRequeridas,
                aplicadoA: isGlobal ? undefined : userIds,
                isGlobal,
              },
            },
          };
        });
      },

      // Nueva función para aplicar a rango de fechas
      setDayConfigRange: (startDate: string, endDate: string, type: DayType, userIds: string[]) => {
        const dates = getDateRange(startDate, endDate);
        const horasRequeridas = type === 'normal' ? 8 : type === 'recuperacion' ? 9 : 0;
        const isGlobal = type === 'feriado';

        set((state) => {
          const newDays = { ...state.days };
          
          dates.forEach((date) => {
            const existingConfig = newDays[date];
            
            // Optimización: evitar duplicados, mergear usuarios si ya existe
            if (existingConfig && existingConfig.type === 'recuperacion' && type === 'recuperacion') {
              const existingUsers = existingConfig.aplicadoA || [];
              const mergedUsers = [...new Set([...existingUsers, ...userIds])];
              newDays[date] = {
                ...existingConfig,
                aplicadoA: mergedUsers,
              };
            } else {
              newDays[date] = {
                date,
                type,
                horasRequeridas,
                aplicadoA: isGlobal ? undefined : userIds,
                isGlobal,
              };
            }
          });

          return { days: newDays };
        });
      },

      getDayConfig: (date: string) => {
        const formattedDate = formatDate(date);
        return get().days[formattedDate] || null;
      },

      // Nueva función: obtener configuración específica para un usuario
      getDayConfigForUser: (date: string, userId: string) => {
        const formattedDate = formatDate(date);
        const config = get().days[formattedDate];
        
        if (!config) return null;
        
        // Si es feriado (global), aplica a todos
        if (config.isGlobal || config.type === 'feriado') {
          return config;
        }
        
        // Si es recuperación, verificar si aplica al usuario
        if (config.type === 'recuperacion') {
          const aplicaAlUsuario = config.aplicadoA?.includes(userId) || false;
          if (aplicaAlUsuario) {
            return config;
          }
          return null; // El usuario no tiene recuperación asignada
        }
        
        return config;
      },

      // Nueva función: obtener horas requeridas para un usuario específico
      getHoursForUser: (date: string, userId: string) => {
        const config = get().getDayConfigForUser(date, userId);
        if (!config) return 8; // Default: día normal
        return config.horasRequeridas;
      },

      // Nueva función: verificar si usuario tiene recuperación en fecha
      hasRecoveryForUser: (date: string, userId: string) => {
        const config = get().getDayConfigForUser(date, userId);
        return config?.type === 'recuperacion';
      },

      removeDayConfig: (date: string) => {
        const formattedDate = formatDate(date);
        set((state) => {
          const newDays = { ...state.days };
          delete newDays[formattedDate];
          return { days: newDays };
        });
      },

      // Nueva función: eliminar configuración de rango
      removeDayConfigRange: (startDate: string, endDate: string) => {
        const dates = getDateRange(startDate, endDate);
        
        set((state) => {
          const newDays = { ...state.days };
          dates.forEach((date) => {
            delete newDays[date];
          });
          return { days: newDays };
        });
      },

      getHoursForDay: (date: string) => {
        const config = get().getDayConfig(date);
        if (!config) return 8; // Default
        return config.horasRequeridas;
      },

      clearAllDays: () => {
        set({ days: {} });
      },
    }),
    {
      name: 'day-config-storage',
    }
  )
);
