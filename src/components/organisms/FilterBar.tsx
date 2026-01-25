// src/components/organisms/FilterBar.tsx
import React from 'react';
import { SearchInput } from '../molecules/SearchInput';
import { CustomSelect } from '../atoms/CustomSelect';

interface FilterOption {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  actions?: React.ReactNode;
  className?: string;
}

export function FilterBar({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = 'Buscar...',
  filters = [],
  actions,
  className = ''
}: FilterBarProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center sm:justify-between">
        
        {/* Busca à ESQUERDA */}
        <div className="flex-1 sm:flex-initial sm:w-96">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Filtros à DIREITA */}
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Filtros dinâmicos */}
          {filters.map((filter, index) => (
            <CustomSelect
              key={index}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              placeholder={filter.placeholder}
            />
          ))}

          {/* Ações customizadas (botões, etc) */}
          {actions}
        </div>

      </div>
    </div>
  );
}