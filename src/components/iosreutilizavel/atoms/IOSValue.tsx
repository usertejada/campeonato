// ====================================
// src/components/atoms/IOSValue.tsx
// ====================================
import React from 'react';

interface IOSValueProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function IOSValue({ children, icon, className = '' }: IOSValueProps) {
  return (
    <p className={`text-[15px] font-semibold text-black flex items-center gap-2 ${className}`}>
      {icon}
      {children}
    </p>
  );
}