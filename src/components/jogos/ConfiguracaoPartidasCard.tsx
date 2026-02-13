// src/components/jogos/ConfiguracaoPartidasCard.tsx

import React from 'react';
import { Clock, CheckCircle, Hash, Timer } from 'lucide-react';
import { Button } from '@/components/molecules/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { CardHeader } from './CardHeader';

interface ConfiguracaoPartidasCardProps {
  horarioInicio: string;
  numeroPartidas: number;
  intervaloEntreJogos: number;
  horariosCalculados: string[];
  temTempoJogo: boolean;
  onHorarioInicioChange: (valor: string) => void;
  onNumeroPartidasChange: (valor: number) => void;
  onIntervaloEntreJogosChange: (valor: number) => void;
  onSalvar: () => void;
}

export function ConfiguracaoPartidasCard({
  horarioInicio,
  numeroPartidas,
  intervaloEntreJogos,
  horariosCalculados,
  temTempoJogo,
  onHorarioInicioChange,
  onNumeroPartidasChange,
  onIntervaloEntreJogosChange,
  onSalvar,
}: ConfiguracaoPartidasCardProps) {
  const isDisabled = !horarioInicio || numeroPartidas <= 0 || !temTempoJogo;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-4">
      <div className="flex items-center justify-between">
        <CardHeader
          icon={Clock}
          iconColor="orange"
          title="Parametro da Partida"
          subtitle="Defina os parâmetros das partidas"
        />

        {/* Botão Salvar */}
        <Button
          className="gap-2"
          variant="primary"
          size="sm"
          leftIcon={CheckCircle}
          onClick={onSalvar}
          disabled={isDisabled}
          mobileIconOnly
        >
          Salvar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Horário de Início"
          type="time"
          value={horarioInicio}
          onChange={(e) => onHorarioInicioChange(e.target.value)}
          leftIcon={Clock}
        />

        <Input
          label="Número de Partidas por Dia"
          type="number"
          value={numeroPartidas || ''}
          onChange={(e) => onNumeroPartidasChange(Number(e.target.value))}
          leftIcon={Hash}
          min={1}
          max={20}
        />

        <Input
          label="Intervalo entre Jogos (minutos)"
          type="number"
          value={intervaloEntreJogos || ''}
          onChange={(e) => onIntervaloEntreJogosChange(Number(e.target.value))}
          leftIcon={Timer}
          min={0}
          max={60}
        />
      </div>

      {/* Preview dos horários */}
      {horariosCalculados.length > 0 && (
        <div className="bg-orange-50 rounded-lg p-4 space-y-2 border-t-2 border-orange-200">
          <p className="text-sm font-semibold text-orange-900">
            📅 Horários das {horariosCalculados.length} partidas:
          </p>
          <div className="flex flex-wrap gap-2">
            {horariosCalculados.map((horario, index) => (
              <Badge key={index} variant="filled" color="orange">
                {index + 1}ª • {horario}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}