'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useCreateActivity, useActivities } from '../hooks';
import { useDayConfigStore } from '@/stores';
import { useMemo, useState, useEffect } from 'react';
import { 
  validateTimeRange, 
  calculateTotalHours, 
  getRemainingHours,
  timeToMinutes 
} from '../utils/timeValidation';

const activityFormSchema = z.object({
  title: z.string().min(1, 'La actividad es requerida').min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(1, 'La descripción es requerida'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato debe ser HH:mm'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato debe ser HH:mm'),
}).refine((data) => {
  const startMinutes = timeToMinutes(data.startTime);
  const endMinutes = timeToMinutes(data.endTime);
  return endMinutes > startMinutes;
}, {
  message: 'La hora de cierre debe ser posterior a la hora de inicio',
  path: ['endTime'],
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormProps {
  selectedDate: Date;
}

export const ActivityForm = ({ selectedDate }: ActivityFormProps) => {
  const createActivity = useCreateActivity();
  const { getDayConfig, getHoursForDay } = useDayConfigStore();
  const [timeConflictError, setTimeConflictError] = useState<string>('');
  const [hoursLimitError, setHoursLimitError] = useState<string>('');

  const { data: activities } = useActivities({ date: selectedDate });
  const existingActivities = activities || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
  });

  const dayConfig = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return getDayConfig(dateStr);
  }, [selectedDate, getDayConfig]);

  const requiredHours = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return getHoursForDay(dateStr);
  }, [selectedDate, getHoursForDay]);

  const totalHoursRegistered = useMemo(() => {
    return calculateTotalHours(existingActivities);
  }, [existingActivities]);

  const remainingHours = useMemo(() => {
    return getRemainingHours(existingActivities, requiredHours);
  }, [existingActivities, requiredHours]);

  const goalAlreadyMet = totalHoursRegistered >= requiredHours && requiredHours > 0;

  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');

  const calculatedHours = useMemo(() => {
    if (!watchStartTime || !watchEndTime) return 0;
    const startMinutes = timeToMinutes(watchStartTime);
    const endMinutes = timeToMinutes(watchEndTime);
    if (endMinutes <= startMinutes) return 0;
    return (endMinutes - startMinutes) / 60;
  }, [watchStartTime, watchEndTime]);

  useEffect(() => {
    if (!watchStartTime || !watchEndTime) {
      setTimeConflictError('');
      setHoursLimitError('');
      return;
    }

    const startMinutes = timeToMinutes(watchStartTime);
    const endMinutes = timeToMinutes(watchEndTime);

    if (endMinutes <= startMinutes) {
      setTimeConflictError('');
      setHoursLimitError('');
      return;
    }

    const validation = validateTimeRange(watchStartTime, watchEndTime, existingActivities);
    
    if (!validation.isValid && validation.conflictingActivity) {
      const conflictStart = new Date(validation.conflictingActivity.startDate);
      const conflictEnd = new Date(validation.conflictingActivity.endDate);
      const startStr = `${conflictStart.getHours().toString().padStart(2, '0')}:${conflictStart.getMinutes().toString().padStart(2, '0')}`;
      const endStr = `${conflictEnd.getHours().toString().padStart(2, '0')}:${conflictEnd.getMinutes().toString().padStart(2, '0')}`;
      
      setTimeConflictError(
        `Este horario se solapa con: "${validation.conflictingActivity.title}" (${startStr} - ${endStr})`
      );
    } else {
      setTimeConflictError('');
    }

    const hoursAfterAdd = totalHoursRegistered + calculatedHours;
    if (hoursAfterAdd > requiredHours && requiredHours > 0) {
      const excess = hoursAfterAdd - requiredHours;
      setHoursLimitError(
        `Esta actividad excede el límite diario en ${excess.toFixed(1)}h`
      );
    } else {
      setHoursLimitError('');
    }
  }, [watchStartTime, watchEndTime, existingActivities, totalHoursRegistered, calculatedHours, requiredHours]);

  const onSubmit = async (data: ActivityFormValues) => {
    const validation = validateTimeRange(data.startTime, data.endTime, existingActivities);
    
    if (!validation.isValid) {
      setError('startTime', {
        type: 'manual',
        message: 'Este horario se solapa con otra actividad',
      });
      return;
    }

    const hoursAfterAdd = totalHoursRegistered + calculatedHours;
    if (hoursAfterAdd > requiredHours && requiredHours > 0) {
      setError('endTime', {
        type: 'manual',
        message: `Excede el límite de ${requiredHours}h del día`,
      });
      return;
    }

    // Usar la fecha seleccionada del calendario
    const activityDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);

    const startDate = new Date(activityDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(activityDate);
    endDate.setHours(endHour, endMin, 0, 0);

    try {
      await createActivity.mutateAsync({
        title: data.title,
        description: data.description,
        startDate,
        endDate,
      });

      reset();
      setTimeConflictError('');
      setHoursLimitError('');
    } catch (error) {
      console.error('Error al registrar actividad:', error);
    }
  };

  const isFeriado = dayConfig?.type === 'feriado';
  const isDisabled = isFeriado || goalAlreadyMet || createActivity.isPending;

  // Formatear fecha para mostrar
  const formattedDate = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Verificar si es hoy
  const isToday = new Date().toDateString() === selectedDate.toDateString();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Indicador de fecha seleccionada */}
      <div className="p-2 bg-slate-100 rounded-lg text-center">
        <p className="text-xs text-slate-500">Registrando actividad para:</p>
        <p className="text-sm font-semibold text-slate-800 capitalize">
          {isToday ? 'Hoy - ' : ''}{formattedDate}
        </p>
      </div>

      {dayConfig && (
        <div className={`p-3 rounded-lg border ${
          dayConfig.type === 'feriado' 
            ? 'bg-red-50 border-red-300' 
            : 'bg-amber-50 border-amber-300'
        }`}>
          <p className={`text-xs font-semibold ${
            dayConfig.type === 'feriado' ? 'text-red-700' : 'text-amber-700'
          }`}>
            {dayConfig.type === 'feriado' 
              ? 'Día Feriado - No se pueden registrar actividades'
              : 'Día de Recuperación - Se requieren 9 horas'
            }
          </p>
        </div>
      )}

      {isFeriado ? (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-center">
          <p className="text-sm text-red-800 font-semibold">
            Este día está marcado como feriado
          </p>
          <p className="text-xs text-red-600 mt-2">
            No se permite el registro de actividades en días feriados.
          </p>
        </div>
      ) : goalAlreadyMet ? (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-center">
          <p className="text-sm text-green-800 font-semibold">
            ¡Objetivo cumplido!
          </p>
          <p className="text-xs text-green-700 mt-2">
            Ya has completado las {requiredHours}h requeridas ({totalHoursRegistered.toFixed(1)}h registradas).
          </p>
        </div>
      ) : (
        <>
          {requiredHours > 0 && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-blue-700 font-semibold">
                    Meta del día: {requiredHours}h
                  </p>
                  <p className="text-xs text-blue-600 font-bold">
                    {remainingHours.toFixed(1)}h restantes
                  </p>
                </div>
                
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((totalHoursRegistered / requiredHours) * 100, 100)}%` 
                    }}
                  />
                </div>
                
                <p className="text-xs text-blue-600 mt-1">
                  Registradas: {totalHoursRegistered.toFixed(1)}h de {requiredHours}h
                </p>
                
                {calculatedHours > 0 && (
                  <p className="text-xs text-blue-700 mt-2 font-semibold">
                    Esta actividad: {calculatedHours.toFixed(1)}h
                  </p>
                )}
              </div>

              {timeConflictError && (
                <div className="p-2 bg-red-50 border border-red-300 rounded text-xs text-red-700 font-semibold">
                  {timeConflictError}
                </div>
              )}
              
              {hoursLimitError && (
                <div className="p-2 bg-amber-50 border border-amber-300 rounded text-xs text-amber-700 font-semibold">
                  {hoursLimitError}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Actividad
            </label>
            <Input
              placeholder="Ej: Reunión de equipo"
              {...register('title')}
              disabled={isDisabled}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Descripción
            </label>
            <Input
              placeholder="Describe la actividad realizada"
              {...register('description')}
              disabled={isDisabled}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Hora de inicio
              </label>
              <Input
                type="time"
                {...register('startTime')}
                disabled={isDisabled}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Hora de cierre
              </label>
              <Input
                type="time"
                {...register('endTime')}
                disabled={isDisabled}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isDisabled || !!timeConflictError || !!hoursLimitError}
            className="w-full"
          >
            {createActivity.isPending ? 'Registrando...' : 'Registrar actividad'}
          </Button>
        </>
      )}
    </form>
  );
};
