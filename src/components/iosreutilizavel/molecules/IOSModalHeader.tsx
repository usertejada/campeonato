// ====================================
// src/components/molecules/IOSModalHeader.tsx
// ====================================
import React from 'react';
import { IOSStatusDot } from '../atoms/IOSStatusDot';

type StatusColor = 'green' | 'blue' | 'gray' | 'red' | 'yellow';

interface IOSModalHeaderProps {
  title: string;
  subtitle: string;
  logo: React.ReactNode;
  status: string;
  statusColor?: StatusColor;
}

export function IOSModalHeader({ 
  title, 
  subtitle, 
  logo, 
  status, 
  statusColor = 'green' 
}: IOSModalHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1">
        <IOSStatusDot label={status} color={statusColor} />
        
        <h1 className="text-2xl font-bold tracking-tight text-black leading-tight mb-1">
          {title}
        </h1>
        
        <p className="text-gray-500 text-sm font-medium">
          {subtitle}
        </p>
      </div>

      <div className="w-[52px] h-[52px] bg-white rounded-2xl flex items-center justify-center shadow-md border border-black/5 flex-shrink-0">
        {logo}
      </div>
    </div>
  );
}