// ====================================
// src/components/atoms/IOSLabel.tsx
// ====================================
import React from 'react';

interface IOSLabelProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function IOSLabel({ children, icon, className = '' }: IOSLabelProps) {
  return (
    <p className={`text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2 ${className}`}>
      {icon}
      {children}
    </p>
  );
}