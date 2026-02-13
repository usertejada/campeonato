// src/components/atoms/Tooltip.tsx
import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export function Tooltip({ children, content, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative inline-block w-full">
      <div
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`cursor-help ${className}`}
      >
        {children}
      </div>
      
      {isVisible && (
        <>
          {/* Backdrop invisível para fechar ao clicar fora (mobile) */}
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsVisible(false)}
            style={{ background: 'transparent' }}
          />
          
          {/* Tooltip */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[101] px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl max-w-[200px] sm:max-w-xs pointer-events-none"
            style={{ 
              animation: 'fadeIn 0.15s ease-in-out',
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            }}
          >
            <div className="text-center break-words">{content}</div>
            {/* Setinha apontando para baixo */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-900 transform rotate-45"
              style={{ marginTop: '-4px' }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}