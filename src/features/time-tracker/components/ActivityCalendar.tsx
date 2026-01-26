'use client';

import { useState } from 'react';

const JANUARY_2026 = new Date(2026, 0, 1);

interface ActivityCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const ActivityCalendar = ({ selectedDate, onDateChange }: ActivityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(JANUARY_2026);

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
        {days.map((day) => (
          <button
            key={day}
            onClick={() =>
              onDateChange(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              )
            }
            className={`aspect-square rounded text-sm font-medium transition-colors ${
              isSelected(day)
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};
