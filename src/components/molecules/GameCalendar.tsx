// src/components/molecules/GameCalendar.tsx

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface GameCalendarProps {
  startDate: string; // ISO format: YYYY-MM-DD
  endDate: string;   // ISO format: YYYY-MM-DD
  selectedDates: string[]; // Array of selected dates in ISO format
  onDateToggle: (date: string) => void;
  disabled?: boolean;
}

interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isInRange: boolean;
  isSelected: boolean;
  dayName: string;
}

export function GameCalendar({ 
  startDate, 
  endDate, 
  selectedDates, 
  onDateToggle,
  disabled = false 
}: GameCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Sempre começa no mês atual
    return new Date();
  });

  const rangeStart = useMemo(() => new Date(startDate), [startDate]);
  const rangeEnd = useMemo(() => new Date(endDate), [endDate]);

  // Gera os dias do calendário do mês atual
  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDay.getDay(); // 0 = Domingo
    const daysInMonth = lastDay.getDate();
    
    const days: CalendarDay[] = [];
    
    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(createCalendarDay(date, false));
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(createCalendarDay(date, true));
    }
    
    // Dias do próximo mês (completar a grid)
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(createCalendarDay(date, false));
    }
    
    return days;
  }, [currentMonth, rangeStart, rangeEnd, selectedDates]);

  function createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const dateString = formatDateToISO(date);
    const isInRange = date >= rangeStart && date <= rangeEnd;
    const isSelected = selectedDates.includes(dateString);
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayName = dayNames[date.getDay()];
    
    return {
      date,
      dateString,
      isCurrentMonth,
      isInRange,
      isSelected,
      dayName,
    };
  }

  function formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function handlePreviousMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function handleDateClick(day: CalendarDay) {
    if (disabled || !day.isInRange) return;
    onDateToggle(day.dateString);
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentMonthName = monthNames[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  const selectedCount = selectedDates.length;

  return (
    <div className="space-y-4">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={disabled}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h4 className="font-bold text-lg text-gray-900">
            {currentMonthName} {currentYear}
          </h4>
          {selectedCount > 0 && (
            <p className="text-xs text-pink-600 mt-1">
              {selectedCount} {selectedCount === 1 ? 'data selecionada' : 'datas selecionadas'}
            </p>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={disabled}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Dias da semana (header) */}
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isToday = 
            day.date.toDateString() === new Date().toDateString();

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={disabled || !day.isInRange}
              className={`
                relative h-12 rounded-lg text-sm font-medium transition-all
                ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                ${!day.isInRange ? 'cursor-not-allowed opacity-40' : ''}
                ${
                  day.isInRange && !day.isSelected
                    ? 'hover:bg-pink-50 hover:border-pink-200 border border-transparent'
                    : ''
                }
                ${
                  day.isSelected
                    ? 'bg-pink-500 text-white font-bold shadow-md hover:bg-pink-600 border-2 border-pink-600'
                    : day.isCurrentMonth && day.isInRange
                    ? 'bg-white text-gray-900 border border-gray-200'
                    : 'bg-gray-50 text-gray-400'
                }
                ${isToday && !day.isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
            >
              {day.date.getDate()}
              
              {/* Indicador de dia selecionado */}
              {day.isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
              )}
              
              {/* Indicador de hoje */}
              {isToday && !day.isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-pink-500" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-blue-400" />
          <span>Hoje</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <span>Fora do período</span>
        </div>
      </div>

      {/* Lista de datas selecionadas */}
      {selectedCount > 0 && (
        <div className="bg-pink-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-900">
            <CalendarIcon className="w-4 h-4" />
            <span>Datas dos Jogos ({selectedCount})</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedDates
              .sort()
              .map(dateStr => {
                const date = new Date(dateStr + 'T00:00:00');
                const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const dayName = dayNames[date.getDay()];
                const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                return (
                  <div
                    key={dateStr}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-pink-200 rounded-lg"
                  >
                    <span className="text-xs font-medium text-pink-900">
                      {dayName} {formatted}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDateToggle(dateStr)}
                      className="text-pink-400 hover:text-pink-600 transition-colors"
                      disabled={disabled}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}