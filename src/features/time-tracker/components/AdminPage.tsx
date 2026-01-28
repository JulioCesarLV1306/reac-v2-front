import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Layout';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import Cardhora from '@/components/Card_hora/card';
import { ActivityCalendar } from './ActivityCalendar';
import { useDayConfigStore } from '@/stores';
import type { DayType } from '@/types/dayConfig';

interface UserConfig {
    id: string;
    nombre: string;
    dependencia: string;
    cargo: string;
    fechaInicio: string;
    fechaTermino: string;
    horasPorTrabajar: string;
    selected: boolean;
}

export const AdminPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDependencia, setSelectedDependencia] = useState('');
    const [users, setUsers] = useState<UserConfig[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 0, 1));
    const [activeTab, setActiveTab] = useState<'horas' | 'feriados'>('horas');
    const [horasTrabajar, setHorasTrabajar] = useState('');
    const [allSelected, setAllSelected] = useState(false);
    const [dayTypeSelection, setDayTypeSelection] = useState<DayType>('feriado');
    
    // Estados para rango de fechas
    const [useRangeMode, setUseRangeMode] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    
    // Day config store
    const { setDayConfig, setDayConfigRange, getDayConfig, removeDayConfig, removeDayConfigRange } = useDayConfigStore();

    // Lista de dependencias disponibles
    const dependencias = useMemo(() => {
        const deps = users.map(u => u.dependencia);
        return ['Todas', ...Array.from(new Set(deps))];
    }, [users]);

    // Datos de ejemplo
    useEffect(() => {
        const mockUsers: UserConfig[] = [
            {
                id: '1',
                nombre: 'Miguel Carrion Franco',
                dependencia: 'Informática',
                cargo: 'Coordinador de informática',
                fechaInicio: '05/01/2025',
                fechaTermino: '09/01/2025',
                horasPorTrabajar: '8 horas',
                selected: false,
            },
            {
                id: '2',
                nombre: 'Miguel Valle Lezama',
                dependencia: 'Informática',
                cargo: 'Asistente de sistemas',
                fechaInicio: '05/01/2025',
                fechaTermino: '09/01/2025',
                horasPorTrabajar: '8 horas',
                selected: false,
            },
            {
                id: '3',
                nombre: 'Alfredo Monzon Rios',
                dependencia: 'Informática',
                cargo: 'Asistente de sistemas',
                fechaInicio: '05/01/2025',
                fechaTermino: '09/01/2025',
                horasPorTrabajar: '8 horas',
                selected: false,
            },
            {
                id: '4',
                nombre: 'Luis Manco Vilcherres',
                dependencia: 'Informática',
                cargo: 'Asistente de sistemas',
                fechaInicio: '05/01/2025',
                fechaTermino: '09/01/2025',
                horasPorTrabajar: '8 horas',
                selected: false,
            },
            {
                id: '5',
                nombre: 'Juliocesar Lopez Vasquez',
                dependencia: 'Informática',
                cargo: 'Asistente de sistemas',
                fechaInicio: '05/01/2025',
                fechaTermino: '09/01/2025',
                horasPorTrabajar: '8 horas',
                selected: false,
            },
        ];
        setUsers(mockUsers);
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = user.nombre.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDependencia = !selectedDependencia ||
                selectedDependencia === 'Todas' ||
                user.dependencia === selectedDependencia;
            return matchesSearch && matchesDependencia;
        });
    }, [users, searchQuery, selectedDependencia]);

    const selectedCount = useMemo(() => {
        return users.filter(u => u.selected).length;
    }, [users]);

    const handleToggleUser = useCallback((userId: string) => {
        setUsers(prev => prev.map(user =>
            user.id === userId
                ? { ...user, selected: !user.selected }
                : user
        ));
    }, []);

    const handleToggleAll = useCallback(() => {
        const newValue = !allSelected;
        setAllSelected(newValue);
        setUsers(prev => prev.map(user => ({ ...user, selected: newValue })));
    }, [allSelected]);

    const handleAplicar = useCallback(() => {
        const selectedUsers = users.filter(u => u.selected);
        const selectedUserIds = selectedUsers.map(u => u.id);
        
        if (activeTab === 'horas') {
            // Aplicar horas trabajadas
            console.log('Aplicando horas:', horasTrabajar, 'para usuarios:', selectedUsers);
            // Aquí iría la llamada a la API para actualizar horas
        } else {
            // Aplicar feriado (global) o recuperación (por usuario)
            
            if (useRangeMode && startDate && endDate) {
                // MODO RANGO: Aplicar a múltiples fechas
                if (dayTypeSelection === 'feriado') {
                    setDayConfigRange(startDate, endDate, 'feriado', []);
                    console.log(`Feriado GLOBAL aplicado para rango: ${startDate} - ${endDate}`);
                } else {
                    if (selectedUserIds.length === 0) {
                        alert('Debe seleccionar al menos un usuario para días de recuperación');
                        return;
                    }
                    setDayConfigRange(startDate, endDate, 'recuperacion', selectedUserIds);
                    console.log(`Recuperación aplicada para ${selectedUserIds.length} usuarios en rango: ${startDate} - ${endDate}`);
                }
            } else {
                // MODO FECHA ÚNICA (calendario)
                const dateStr = selectedDate.toISOString().split('T')[0];
                
                if (dayTypeSelection === 'feriado') {
                    setDayConfig(dateStr, 'feriado', []);
                    console.log(`Feriado GLOBAL aplicado para la fecha:`, dateStr);
                } else {
                    if (selectedUserIds.length === 0) {
                        alert('Debe seleccionar al menos un usuario para días de recuperación');
                        return;
                    }
                    setDayConfig(dateStr, 'recuperacion', selectedUserIds);
                    console.log(`Día de recuperación aplicado para usuarios:`, selectedUserIds);
                }
            }
        }
        
        // Actualizar tabla con nuevas horas
        setUsers(prev => prev.map(user => {
            if (user.selected || dayTypeSelection === 'feriado') {
                const newHours = dayTypeSelection === 'recuperacion' ? '9 horas' : 
                               dayTypeSelection === 'feriado' ? '0 horas (feriado)' : 
                               `${horasTrabajar} horas`;
                return { ...user, horasPorTrabajar: newHours };
            }
            return user;
        }));
        
        // Mostrar confirmación
        const rangeInfo = useRangeMode && startDate && endDate 
            ? `desde ${startDate} hasta ${endDate}` 
            : `para ${selectedDate.toLocaleDateString('es-ES')}`;
        alert(`✅ Configuración aplicada ${rangeInfo}`);
        
    }, [users, horasTrabajar, activeTab, selectedDate, dayTypeSelection, setDayConfig, setDayConfigRange, useRangeMode, startDate, endDate]);

    const handleBorrarFeriados = useCallback(() => {
        if (useRangeMode && startDate && endDate) {
            removeDayConfigRange(startDate, endDate);
            console.log('Configuración borrada para rango:', startDate, '-', endDate);
        } else {
            const dateStr = selectedDate.toISOString().split('T')[0];
            removeDayConfig(dateStr);
            console.log('Feriados borrados para:', dateStr);
        }
        
        // Restaurar horas normales (8 horas)
        setUsers(prev => prev.map(user => {
            if (user.selected) {
                return { ...user, horasPorTrabajar: '8 horas' };
            }
            return user;
        }));
    }, [selectedDate, removeDayConfig, removeDayConfigRange, useRangeMode, startDate, endDate]);

    // Obtener configuración del día seleccionado
    const currentDayConfig = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return getDayConfig(dateStr);
    }, [selectedDate, getDayConfig]);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">Configuración de horas trabajadas</h1>
                    <Cardhora />
                </div>

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Left Side - Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Filtro por dependencia */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Filtrar por dependencia
                                    </label>
                                    <select
                                        value={selectedDependencia}
                                        onChange={(e) => setSelectedDependencia(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a71900] focus:border-transparent bg-white text-slate-600"
                                    >
                                        <option value="">Seleccionar dependencia</option>
                                        {dependencias.map((dep) => (
                                            <option key={dep} value={dep}>
                                                {dep}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Buscar usuario */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Buscar usuario
                                    </label>
                                    <div className="relative">
                                        <svg
                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <Input
                                            type="text"
                                            placeholder="Buscar usuario por nombres y/o apellidos"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calendar */}
                    <Card className='p-4'>
                        <CardContent className="flex justify-center">
                            <ActivityCalendar
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                            />
                        </CardContent>
                    </Card>

                    {/* Right Side - Config */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Tabs */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('horas')}
                                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'horas'
                                                ? 'bg-[#f4a6a6] text-[#a71900]'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Horas a trabajar
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('feriados')}
                                        className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'feriados'
                                                ? 'bg-[#f4a6a6] text-[#a71900]'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Feriados
                                    </button>
                                </div>

                                {/* Config Section */}
                                {activeTab === 'horas' ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600">
                                            Durante este rango de fechas se trabajarán
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={horasTrabajar}
                                                onChange={(e) => setHorasTrabajar(e.target.value)}
                                                placeholder="--"
                                                className="w-20 text-center"
                                            />
                                            <span className="text-sm text-gray-700">
                                                horas para los servidores seleccionados.
                                            </span>
                                        </div>
                                        <Button
                                            onClick={handleAplicar}
                                            disabled={selectedCount === 0 || !horasTrabajar}
                                            style={{ backgroundColor: '#a71900' }}
                                            className="w-full bg-[#a71900] hover:bg-[#8b1538] text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Aplicar para seleccionados
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {dayTypeSelection === 'feriado' ? (
                                            <p className="text-sm text-gray-700 font-medium">
                                                Marcar fecha como <span className="font-bold text-red-700">feriado global</span>. Ningún usuario podrá registrar actividades en esta fecha.
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-700 font-medium">
                                                Marcar fecha como <span className="font-bold text-amber-700">día de recuperación</span> para usuarios seleccionados (9 horas requeridas).
                                            </p>
                                        )}
                                        
                                        {/* Información del día seleccionado */}
                                        {currentDayConfig && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <p className="text-xs text-amber-900 font-semibold">
                                                    Este día está marcado como:{' '}
                                                    <span className="uppercase">{currentDayConfig.type}</span>
                                                </p>
                                                <p className="text-xs text-amber-700 mt-1">
                                                    Horas requeridas: {currentDayConfig.horasRequeridas}h
                                                </p>
                                            </div>
                                        )}

                                        {/* Selector de tipo de día */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Tipo de día especial
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setDayTypeSelection('feriado')}
                                                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                                        dayTypeSelection === 'feriado'
                                                            ? 'border-red-500 bg-red-50 text-red-700'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="text-sm font-semibold">Feriado</div>
                                                    <div className="text-xs mt-1">0 horas</div>
                                                </button>
                                                <button
                                                    onClick={() => setDayTypeSelection('recuperacion')}
                                                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                                        dayTypeSelection === 'recuperacion'
                                                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className="text-sm font-semibold">Recuperación</div>
                                                    <div className="text-xs mt-1">9 horas (8+1)</div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Toggle: Fecha única vs Rango de fechas */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Modo de selección
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setUseRangeMode(false)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                        !useRangeMode
                                                            ? 'bg-slate-700 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    📅 Fecha única
                                                </button>
                                                <button
                                                    onClick={() => setUseRangeMode(true)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                        useRangeMode
                                                            ? 'bg-slate-700 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    📆 Rango de fechas
                                                </button>
                                            </div>
                                        </div>

                                        {/* Date Range Picker (solo visible en modo rango) */}
                                        {useRangeMode && (
                                            <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <p className="text-xs text-slate-600 font-medium">
                                                    Seleccione el rango de fechas para aplicar masivamente:
                                                </p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-slate-600">
                                                            Fecha inicio
                                                        </label>
                                                        <Input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={(e) => setStartDate(e.target.value)}
                                                            className="w-full text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-slate-600">
                                                            Fecha fin
                                                        </label>
                                                        <Input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e.target.value)}
                                                            min={startDate}
                                                            className="w-full text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                {startDate && endDate && (
                                                    <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                                                        ✓ Rango seleccionado: <strong>{startDate}</strong> → <strong>{endDate}</strong>
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Indicador de fecha única (cuando no es rango) */}
                                        {!useRangeMode && (
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                <p className="text-xs text-slate-600">
                                                    Fecha seleccionada: <strong>{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleAplicar}
                                                disabled={(dayTypeSelection === 'recuperacion' && selectedCount === 0) || (useRangeMode && (!startDate || !endDate))}
                                                style={{ backgroundColor: '#a71900' }}
                                                className="flex-1 bg-[#a71900] hover:bg-[#8b1538] text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {useRangeMode 
                                                    ? `Aplicar ${dayTypeSelection === 'feriado' ? 'feriados' : 'recuperación'} (rango)`
                                                    : dayTypeSelection === 'feriado' 
                                                        ? 'Aplicar feriado (global)' 
                                                        : 'Aplicar recuperación'
                                                }
                                            </Button>
                                            <Button
                                                onClick={handleBorrarFeriados}
                                                disabled={useRangeMode && (!startDate || !endDate)}
                                                variant="outline"
                                                className="flex-1 border-red-300 text-red-700 hover:bg-red-50 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {useRangeMode ? 'Borrar (rango)' : 'Borrar config'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead style={{ backgroundColor: '#a71900' }}>
                                    <tr>
                                        <th className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={handleToggleAll}
                                                className="w-5 h-5 rounded border-white text-[#a71900] focus:ring-2 focus:ring-white cursor-pointer"
                                            />
                                        </th>
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
                                            Fecha inicio
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Fecha termino
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                                            Horas por trabajar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={user.selected}
                                                        onChange={() => handleToggleUser(user.id)}
                                                        className="w-5 h-5 rounded border-slate-300 text-[#a71900] focus:ring-2 focus:ring-[#a71900] cursor-pointer"
                                                    />
                                                </td>
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
                                                    {user.fechaInicio}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {user.fechaTermino}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {user.horasPorTrabajar}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
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

                {/* Panel de días especiales configurados */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            📋 Días Especiales Configurados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ConfiguredDaysPreview />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Componente para mostrar días configurados
const ConfiguredDaysPreview = () => {
    const { days, removeDayConfig } = useDayConfigStore();
    
    const configuredDays = useMemo(() => {
        return Object.values(days)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 20); // Mostrar solo los primeros 20
    }, [days]);

    if (configuredDays.length === 0) {
        return (
            <p className="text-sm text-slate-500 text-center py-4">
                No hay días especiales configurados
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {configuredDays.map((config) => (
                    <div
                        key={config.date}
                        className={`p-3 rounded-lg border ${
                            config.type === 'feriado'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-amber-50 border-amber-200'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`text-sm font-semibold ${
                                    config.type === 'feriado' ? 'text-red-700' : 'text-amber-700'
                                }`}>
                                    {new Date(config.date + 'T12:00:00').toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                    })}
                                </p>
                                <p className={`text-xs ${
                                    config.type === 'feriado' ? 'text-red-600' : 'text-amber-600'
                                }`}>
                                    {config.type === 'feriado' ? '🚫 Feriado (Global)' : `⏰ Recuperación (${config.aplicadoA?.length || 0} usuarios)`}
                                </p>
                            </div>
                            <button
                                onClick={() => removeDayConfig(config.date)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Eliminar configuración"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {Object.keys(days).length > 20 && (
                <p className="text-xs text-slate-500 text-center">
                    ... y {Object.keys(days).length - 20} días más
                </p>
            )}
        </div>
    );
};

export default memo(AdminPage);
