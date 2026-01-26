'use client';

import { useState } from 'react';
import type { Activity } from '../types';
import { formatActivityForDisplay } from '../utils';
import { Button } from '@/components/Button';
import { useDeleteActivity } from '../hooks';
import { ActivityDetailModal } from './ActivityDetailModal';

interface ActivityTableProps {
  activities: Activity[];
}

export const ActivityTable = ({ activities }: ActivityTableProps) => {
  const deleteActivity = useDeleteActivity();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No hay actividades para esta fecha</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actividad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha de inicio</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha de cierre</th>
              {/* <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th> */}
              <th className="px-6 py-3 text-left text-sm font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {activities.map((activity) => {
              const formatted = formatActivityForDisplay(activity);
              return (
                <tr key={activity.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-500">{activity.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatted.formattedDate} {formatted.formattedStartTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatted.formattedEndTime}
                  </td>
                  {/* <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : activity.status === 'Completada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td> */}
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleViewDetail(activity)}
                      variant="destructive"
                      size="sm"
                    >
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
