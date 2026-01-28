import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/Layout';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { WorkerActivitiesView } from './WorkerActivitiesView';
import Cardhora from '@/components/Card_hora/card';

interface UserActivity {
  id: string;
  nombre: string;
  dependencia: string;
  cargo: string;
  ultimaActividad: string;
}

export const SupervisorPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null);

  // Actualizar hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Datos de ejemplo - estos deberían venir de una API
  useEffect(() => {
    const mockUsers: UserActivity[] = [
      {
        id: '1',
        nombre: 'Gabriel Joaquin Andrade Hidalgo',
        dependencia: 'Informática',
        cargo: 'Asistente de sistemas',
        ultimaActividad: '01/01/2026 08:55',
      },
      {
        id: '2',
        nombre: 'Juliocesar Lopez Vasquez',
        dependencia: 'Informática',
        cargo: 'Asistente de sistemas',
        ultimaActividad: '01/01/2026 08:55',
      },
      {
        id: '3',
        nombre: 'Gabriel Joaquin Andrade Hidalgo',
        dependencia: 'Informática',
        cargo: 'Asistente de sistemas',
        ultimaActividad: '01/01/2026 08:55',
      },
      {
        id: '4',
        nombre: 'Juliocesar Lopez Vasquez',
        dependencia: 'Informática',
        cargo: 'Asistente de sistemas',
        ultimaActividad: '01/01/2026 08:55',
      },
      {
        id: '5',
        nombre: 'Gabriel Joaquin Andrade Hidalgo',
        dependencia: 'Informática',
        cargo: 'Asistente de sistemas',
        ultimaActividad: '01/01/2026 08:55',
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) =>
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [users, searchQuery]
  );

  const handleSearch = useCallback(() => {
    // Aquí iría la lógica de búsqueda con la API
    console.log('Buscando:', searchQuery);
  }, [searchQuery]);

  const handleVerActividades = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  }, [users]);

  const handleBackToList = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Si hay un usuario seleccionado, mostrar la vista de actividades
  if (selectedUser) {
    return (
      <WorkerActivitiesView
        userInfo={selectedUser}
        onBack={handleBackToList}
      />
    );
  }

  // Vista principal: lista de usuarios
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className=" sm:w-[70%] w-full">
                <h1 className=" font-bold text-slate-900">Supervisar actividades</h1>
            </div>
           <Cardhora />
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <label className="text-base font-semibold text-slate-700">
                Buscar usuario
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Buscar usuario por nombres y/o apellidos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  onClick={handleSearch}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-8"
                >
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#a71900' }} className="text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Dependencia
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Cargo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Última actividad
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Ver actividades
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {user.nombre}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.dependencia}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.cargo}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.ultimaActividad}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerActividades(user.id)}
                            className="flex items-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        No se encontraron usuarios
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
  );
};

export default memo(SupervisorPage);
