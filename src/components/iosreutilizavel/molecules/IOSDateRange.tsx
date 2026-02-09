// ====================================
// src/components/molecules/IOSDateRange.tsx
// ====================================
import React from 'react';

interface IOSDateRangeProps {
  startDate: string;
  endDate: string;
}

export function IOSDateRange({ startDate, endDate }: IOSDateRangeProps) {
  return (
    <div className="flex justify-between items-end mb-3">
      <div>
        <p className="text-[10px] font-bold text-black/40 mb-1">INÍCIO</p>
        <p className="text-sm font-bold text-black">{startDate}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-black/40 mb-1">TÉRMINO</p>
        <p className="text-sm font-bold text-black">{endDate}</p>
      </div>
    </div>
  );
}