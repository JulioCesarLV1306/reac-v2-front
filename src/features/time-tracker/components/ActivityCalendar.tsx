'use client';

import { useState } from 'react';
import { useDayConfigStore } from '@/stores';
import { DAY_COLORS } from '@/types/dayConfig';

const JANUARY_2026 = new Date(2026, 0, 1);

interface ActivityCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const ActivityCalendar = ({ selectedDate, onDateChange }: ActivityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(JANUARY_2026);
  const { getDayConfig } = useDayConfigStore();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const getDayStyle = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const config = getDayConfig(dateStr);
    
    if (!config) {
      return isSelected(day)
        ? 'bg-slate-900 text-white border-slate-900'
        : 'bg-white text-slate-900 hover:bg-slate-100 border-slate-200';
    }

    const colors = DAY_COLORS[config.type];
    
    if (config.type === 'feriado') {
      return isSelected(day)
        ? 'bg-red-600 text-white border-red-600'
        : `${colors.bg} ${colors.text} border-2 ${colors.border} hover:bg-red-200`;
    }
    
    if (config.type === 'recuperacion') {
      return isSelected(day)
        ? 'bg-amber-600 text-white border-amber-600'
        : `${colors.bg} ${colors.text} border-2 ${colors.border} hover:bg-amber-200`;
    }

    return isSelected(day)
      ? 'bg-slate-900 text-white border-slate-900'
      : 'bg-white text-slate-900 hover:bg-slate-100 border-slate-200';
  };

  return (
    <div className="space-y-4">
      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded"
        >
          ←
        </button>
        <span className="font-semibold text-slate-900">
          {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={nextMonth}
          className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-600">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day buttons */}
        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateStr = date.toISOString().split('T')[0];
          const config = getDayConfig(dateStr);
          const isFeriado = config?.type === 'feriado';
          
          return (
            <button
              key={day}
              onClick={() => !isFeriado && onDateChange(date)}
              disabled={isFeriado}
              title={isFeriado ? 'Día feriado - No disponible' : undefined}
              className={`aspect-square rounded text-sm font-medium transition-all relative ${getDayStyle(day)} ${isFeriado ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              {day}
              {isFeriado && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-red-500 rotate-45 absolute" />
                </div>
              )}
              {config && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  <div className={`w-1 h-1 rounded-full ${
                    config.type === 'feriado' ? 'bg-red-600' : 'bg-amber-600'
                  }`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
