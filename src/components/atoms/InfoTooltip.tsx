// ========================================
// src/components/atoms/InfoTooltip.tsx
// ========================================
import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function InfoTooltip({ message, position = 'top' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        aria-label="Informação"
      >
        <Info size={16} />
      </button>

      {isVisible && (
        <div className={`absolute z-[9999] ${positionClasses[position]} w-48`}>
          <div className="bg-gray-800 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl">
            <p className="leading-snug whitespace-normal">{message}</p>
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}