'use client';

import { useState } from 'react';
import { useActivities, useActivityStats } from '../hooks';
import { ActivityCalendar } from './ActivityCalendar';
import { ActivityTable } from './ActivityTable';
import { ActivityForm } from './ActivityForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Layout';
import Cardhora from '@/components/Card_hora/card';

export const ActivitiesPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { data: activities, isLoading, isError } = useActivities({ date: selectedDate });
    const stats = useActivityStats(activities);

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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Sidebar - Calendario */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Seleccionar fecha</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                            </CardContent>
                            {/* divider */}
                            <hr className="border-t border-slate-200 my-4" />
                            < ActivityForm />

                        </Card>


                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500">Total de horas trabajadas</p>
                                        <p className="mt-2 text-2xl font-bold text-slate-900">
                                            {stats.formattedHours}
                                        </p>
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
                                        <p className="text-sm text-slate-500">Completadas</p>
                                        <p className="mt-2 text-2xl font-bold text-slate-900">
                                            {stats.completedActivities}
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
