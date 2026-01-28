'use client';

import { useState, useMemo, useCallback } from 'react';
import { useActivities, useActivityStats } from '../hooks';
import { ActivityCalendar } from './ActivityCalendar';
import { ActivityTable } from './ActivityTable';
import { ActivityForm } from './ActivityForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Layout';
import Cardhora from '@/components/Card_hora/card';
import { useDayConfigStore, useAuthStore } from '@/stores';

export const ActivitiesPage = () => {
    // ============================================
    // ESTADO: Fecha seleccionada (por defecto HOY)
    // ============================================
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    // ============================================
    // DATOS: Actividades del día seleccionado
    // ============================================
    const { data: activities, isLoading, isError } = useActivities({ date: selectedDate });
    const stats = useActivityStats(activities);
    
    // ============================================
    // AUTH: Obtener usuario actual
    // ============================================
    const { user } = useAuthStore();
    const currentUserId = user?.id || 'default-user';

    // ============================================
    // STORE: Configuración de días (feriados/recuperación)
    // ============================================
    const { getDayConfig, getHoursForUser, hasRecoveryForUser } = useDayConfigStore();

    // ============================================
    // COMPUTED: Configuración del día seleccionado
    // ============================================
    const dayConfig = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return getDayConfig(dateStr);
    }, [selectedDate, getDayConfig]);

    // ============================================
    // COMPUTED: Meta de horas del día PARA ESTE USUARIO
    // - Día Normal: 8 horas
    // - Día de Recuperación (si aplica a este usuario): 9 horas  
    // - Día Feriado: 0 horas (bloqueado)
    // ============================================
    const requiredHours = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return getHoursForUser(dateStr, currentUserId);
    }, [selectedDate, getHoursForUser, currentUserId]);

    // ============================================
    // COMPUTED: Verificar si este usuario tiene recuperación
    // ============================================
    const isRecoveryForUser = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return hasRecoveryForUser(dateStr, currentUserId);
    }, [selectedDate, hasRecoveryForUser, currentUserId]);

    // ============================================
    // COMPUTED: Estado de cumplimiento de objetivo
    // ============================================
    const goalMet = stats.totalHours >= requiredHours && requiredHours > 0;
    const hoursDifference = Math.abs(stats.totalHours - requiredHours);

    // ============================================
    // COMPUTED: Verificar si es feriado (bloqueado)
    // ============================================
    const isHoliday = dayConfig?.type === 'feriado';

    // ============================================
    // COMPUTED: Tipo de día para UI (considera si aplica a este usuario)
    // ============================================
    const dayType = useMemo(() => {
        if (dayConfig?.type === 'feriado') return 'feriado';
        if (isRecoveryForUser) return 'recuperacion';
        return 'normal';
    }, [dayConfig, isRecoveryForUser]);

    // ============================================
    // HANDLER: Cambio de fecha con validación
    // ============================================
    const handleDateChange = useCallback((date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const config = getDayConfig(dateStr);
        
        // Si es feriado, no permitir selección (doble seguridad)
        if (config?.type === 'feriado') {
            console.warn('No se puede seleccionar un día feriado');
            return;
        }
        
        setSelectedDate(date);
    }, [getDayConfig]);

    // ============================================
    // HELPER: Mensaje según tipo de día (para este usuario)
    // ============================================
    const getDayMessage = () => {
        // Feriado global: aplica a todos
        if (dayConfig?.type === 'feriado') {
            return {
                message: '🎉 Día feriado - No laborable',
                color: 'text-red-700',
                bgColor: 'bg-red-50',
            };
        }

        // Recuperación específica para este usuario
        if (isRecoveryForUser) {
            return {
                message: '⚠️ Día de recuperación - Se requiere 1 hora adicional',
                color: 'text-amber-700',
                bgColor: 'bg-amber-50',
            };
        }

        // Día normal
        return {
            message: 'Día normal',
            color: 'text-slate-600',
            bgColor: 'bg-slate-50',
        };
    };

    const dayMessage = getDayMessage();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 border-b border-slate-200 pb-4 row-gap-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Mis actividades</h1>
                        <p className="mt-1 text-slate-500">Gestiona y registra tus actividades diarias</p>
                    </div>
                {/* card de la hora actual */}
                <Cardhora />
                </div>

                {/* Indicador de tipo de día */}
                {(dayConfig || dayType !== 'normal') && (
                    <div className={`mb-6 p-4 rounded-lg border-2 ${
                        isHoliday 
                            ? 'border-red-300 bg-red-50' 
                            : dayType === 'recuperacion'
                                ? 'border-amber-300 bg-amber-50'
                                : 'border-slate-200 bg-slate-50'
                    }`}>
                        <p className={`text-sm font-semibold ${dayMessage.color}`}>
                            {dayMessage.message}
                        </p>
                        {isHoliday ? (
                            <p className="text-xs text-red-600 mt-1 font-semibold">
                                🚫 No se permite el registro de actividades en este día
                            </p>
                        ) : (
                            <p className="text-xs text-slate-600 mt-1">
                                Horas requeridas: <span className="font-bold">{requiredHours}h</span>
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Sidebar - Calendario */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Seleccionar fecha</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
                            </CardContent>
                            {/* divider */}
                            <hr className="border-t border-slate-200 my-4" />
                            <ActivityForm selectedDate={selectedDate} />

                        </Card>


                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <Card className={goalMet && requiredHours > 0 ? 'ring-2 ring-green-500' : ''}>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">Total de horas trabajadas</p>
                                        <p className={`mt-2 text-2xl font-bold ${
                                            goalMet ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {stats.formattedHours}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">Meta del día</p>
                                        <p className={`mt-2 text-2xl font-bold ${
                                            dayConfig?.type === 'feriado' ? 'text-red-600' :
                                            dayConfig?.type === 'recuperacion' ? 'text-amber-600' :
                                            'text-slate-900'
                                        }`}>
                                            {requiredHours}h
                                        </p>
                                        {dayConfig && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {dayConfig.type === 'feriado' ? 'Feriado' : 'Recuperación'}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">Actividades</p>
                                        <p className="mt-2 text-2xl font-bold text-slate-900">
                                            {stats.totalActivities}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">
                                            {goalMet ? 'Objetivo cumplido ✓' : 'Faltan'}
                                        </p>
                                        <p className={`mt-2 text-2xl font-bold ${
                                            goalMet ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {goalMet ? '✓' : `${hoursDifference.toFixed(1)}h`}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Activities Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actividades del {new Date(selectedDate).toLocaleDateString('es-ES')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <p className="text-center text-slate-500">Cargando actividades...</p>
                                ) : isError ? (
                                    <p className="text-center text-red-500">Error al cargar las actividades</p>
                                ) : (
                                    <ActivityTable activities={activities || []} />
                                )}
                            </CardContent>
                        </Card>

                        {/* New Activity Form */}

                        {/* <Card>
              <CardHeader>
                <CardTitle>Nueva actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityForm />
              </CardContent>
            </Card> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
