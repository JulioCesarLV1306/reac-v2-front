import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/Layout';
import { Button } from '@/components/Button';
import { ActivityCalendar } from './ActivityCalendar';
import type { Activity } from '../types';
import { formatActivityForDisplay } from '../utils';
import Cardhora from '@/components/Card_hora/card';
import { useDayConfigStore } from '@/stores';

interface UserInfo {
  id: string;
  nombre: string;
  dependencia: string;
  cargo: string;
}

interface WorkerActivitiesViewProps {
  userInfo: UserInfo;
  onBack: () => void;
}

type ValidationStatus = 'pending' | 'approved' | 'rejected';

interface ActivityWithValidation extends Activity {
  validationStatus?: ValidationStatus;
}

export const WorkerActivitiesView = ({ userInfo, onBack }: WorkerActivitiesViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 0, 1)); // 01/01/2025
  const [activities, setActivities] = useState<ActivityWithValidation[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [observation, setObservation] = useState('');
  
  const { getDayConfig, getHoursForDay } = useDayConfigStore();

  // Obtener configuración del día seleccionado
  const dayConfig = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return getDayConfig(dateStr);
  }, [selectedDate, getDayConfig]);

  const requiredHours = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return getHoursForDay(dateStr);
  }, [selectedDate, getHoursForDay]);

  // Actualizar hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Datos de ejemplo - estos deberían venir de una API basada en userId y fecha
  useEffect(() => {
    const mockActivities: ActivityWithValidation[] = [
      {
        id: '1',
        title: 'Actividad ejemplo',
        description: 'Aquí debe escribir la descripción de la actividad que realizó',
        startDate: new Date(2025, 0, 1, 8, 5),
        endDate: new Date(2025, 0, 1, 8, 55),
        startTime: new Date(2025, 0, 1, 8, 5),
        endTime: new Date(2025, 0, 1, 8, 55),
        status: 'Pendiente',
        userId: userInfo.id,
        validationStatus: 'pending',
      },
    ];
    setActivities(mockActivities);
  }, [userInfo.id, selectedDate]);

  const calculateTotalHours = () => {
    const totalMinutes = activities.reduce((total, activity) => {
      const start = new Date(activity.startDate);
      const end = new Date(activity.endDate);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60);
      return total + diff;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}min`;
  };

  const calculateDuration = (activity: Activity) => {
    const start = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return `${Math.floor(diff)} min`;
  };

  const handleValidation = (activityId: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected') {
      // Abrir modal para ingresar observación
      setSelectedActivityId(activityId);
      setShowRejectModal(true);
      return;
    }

    // Para aprobación directa
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, validationStatus: status }
          : activity
      )
    );
    // Aquí iría la llamada a la API para guardar la validación
    console.log(`Actividad ${activityId} aprobada`);
  };

  const handleSaveRejection = () => {
    if (!observation.trim()) {
      alert('Por favor ingrese una observación');
      return;
    }

    setActivities(prev =>
      prev.map(activity =>
        activity.id === selectedActivityId
          ? { ...activity, validationStatus: 'rejected' }
          : activity
      )
    );
    
    // Aquí iría la llamada a la API para guardar la validación con observación
    console.log(`Actividad ${selectedActivityId} rechazada. Observación: ${observation}`);
    
    // Cerrar modal y limpiar
    setShowRejectModal(false);
    setObservation('');
    setSelectedActivityId('');
  };

  const handleCancelRejection = () => {
    setShowRejectModal(false);
    setObservation('');
    setSelectedActivityId('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header con botón de regreso */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2 bg-slate-700 text-black hover:bg-slate-800 border-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Button>
              <h1 className="text-3xl font-bold text-slate-900">Supervisar actividades</h1>
            </div>
            <Cardhora />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar - Información del trabajador y calendario */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información del trabajador */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Actividades de</p>
                    <p className="font-bold text-slate-900">{userInfo.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Dependencia</p>
                    <p className="font-semibold text-slate-900">{userInfo.dependencia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Cargo</p>
                    <p className="font-semibold text-slate-900">{userInfo.cargo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendario */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Seleccionar fecha</h3>
                <ActivityCalendar
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Actividades */}
          <div className="lg:col-span-3">
            {/* Indicador de tipo de día */}
            {dayConfig && (
              <div className={`mb-4 p-4 rounded-lg border-2 ${
                dayConfig.type === 'feriado' 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-amber-300 bg-amber-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${
                      dayConfig.type === 'feriado' ? 'text-red-700' : 'text-amber-700'
                    }`}>
                      {dayConfig.type === 'feriado' 
                        ? '🎉 Día Feriado - No se requieren horas'
                        : '⚠️ Día de Recuperación - Se requieren 9 horas'
                      }
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Horas requeridas: <span className="font-bold">{requiredHours}h</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardContent className="pt-6">
                {/* Header de la tabla */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    Actividades del {formatDateDisplay(selectedDate)}
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total de horas trabajadas:</p>
                    <p className={`text-2xl font-bold ${
                      activities.length > 0 
                        ? (calculateTotalHours().split('h')[0] >= requiredHours.toString() 
                            ? 'text-green-600' 
                            : 'text-red-600')
                        : 'text-slate-900'
                    }`}>
                      {activities.length > 0 ? calculateTotalHours() : '-- horas'}
                    </p>
                    {requiredHours > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Meta: {requiredHours}h
                      </p>
                    )}
                  </div>
                </div>

                {/* Tabla de actividades */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: '#a71900' }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                          Descripción
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                          Hora de inicio
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                          Hora de cierre
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                          Horas trabajadas
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                          Validación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {activities.length > 0 ? (
                        activities.map((activity) => {
                          const formatted = formatActivityForDisplay(activity);
                          return (
                            <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-slate-900">
                                {activity.description}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {formatted.formattedStartTime}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {formatted.formattedEndTime}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {calculateDuration(activity)}
                              </td>
                              <td className="px-6 py-4">
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
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant={activity.validationStatus === 'approved' ? 'default' : 'outline'}
                                    onClick={() => handleValidation(activity.id, 'approved')}
                                    className={`${
                                      activity.validationStatus === 'approved'
                                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                                        : 'border-green-600 text-green-600 hover:bg-green-50'
                                    }`}
                                    disabled={activity.validationStatus === 'approved'}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={activity.validationStatus === 'rejected' ? 'default' : 'outline'}
                                    onClick={() => handleValidation(activity.id, 'rejected')}
                                    className={`${
                                      activity.validationStatus === 'rejected'
                                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                                        : 'border-red-600 text-red-600 hover:bg-red-50'
                                    }`}
                                    disabled={activity.validationStatus === 'rejected'}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-8 text-center text-sm text-slate-500"
                          >
                            No hay actividades para esta fecha
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    
      {/* Modal de rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center p-4 z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Ingresar observación
            </h2>
            
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Aqui el supervisor debe redactar el motivo por el cual rechazó la actividad realizada por su trabajador"
              className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a71900] focus:border-transparent resize-none text-sm"
            />

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCancelRejection}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveRejection}
                style={{ backgroundColor: '#a71900' }}
                className="flex-1 bg-[#a71900] hover:bg-[#8b1538] text-white"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
