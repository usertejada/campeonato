// ====================================
// src/components/molecules/IOSProgressBar.tsx
// ====================================
import React from 'react';

interface IOSProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

export function IOSProgressBar({ progress, label }: IOSProgressBarProps) {
  return (
    <div>
      <div className="h-1.5 bg-black/5 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {label && (
        <p className="text-[10px] text-center text-blue-500 font-bold">
          {label}
        </p>
      )}
    </div>
  );
}