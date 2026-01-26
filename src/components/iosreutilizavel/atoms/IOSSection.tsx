// ====================================
// src/components/atoms/IOSSection.tsx
// ====================================
import React from 'react';

interface IOSSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function IOSSection({ children, className = '' }: IOSSectionProps) {
  return (
    <div className={`bg-black/[0.04] rounded-[20px] p-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}