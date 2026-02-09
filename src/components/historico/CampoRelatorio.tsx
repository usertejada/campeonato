// src/components/historico/CampoRelatorio.tsx

import React from 'react';

interface CampoRelatorioProps {
  valor: string;
  onChange: (valor: string) => void;
}

export function CampoRelatorio({ valor, onChange }: CampoRelatorioProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-medium text-gray-500 mb-1 ml-0.5">
        Relatório da Partida <span className="text-red-400 ml-1">*</span>
      </label>
      <textarea
        placeholder="Descreva como foi a partida, principais lances, comportamento dos times, etc..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 bg-gray-100/50 border border-gray-300 focus:border-blue-400 focus:bg-white rounded-xl text-[14px] text-gray-900 outline-none transition-all resize-none placeholder:text-gray-400"
        required
      />
    </div>
  );
}