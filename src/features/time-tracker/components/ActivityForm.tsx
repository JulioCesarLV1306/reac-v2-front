'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useCreateActivity } from '../hooks';

const activityFormSchema = z.object({
  title: z.string().min(1, 'La actividad es requerida').min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(1, 'La descripción es requerida'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato debe ser HH:mm'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato debe ser HH:mm'),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export const ActivityForm = () => {
  const createActivity = useCreateActivity();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
  });

  const onSubmit = async (data: ActivityFormValues) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);

    const startDate = new Date(today);
    startDate.setHours(startHour, startMin);

    const endDate = new Date(today);
    endDate.setHours(endHour, endMin);

    await createActivity.mutateAsync({
      title: data.title,
      description: data.description,
      startDate,
      endDate,
    });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">
          Actividad
        </label>
        <Input
          placeholder="Ej: Reunión de equipo"
          {...register('title')}
          disabled={createActivity.isPending}
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
          disabled={createActivity.isPending}
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
            disabled={createActivity.isPending}
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
            disabled={createActivity.isPending}
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={createActivity.isPending}
        className="w-full"
      >
        {createActivity.isPending ? 'Registrando...' : 'Registrar actividad'}
      </Button>
    </form>
  );
};
