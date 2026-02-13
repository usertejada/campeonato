// src/components/jogos/LocaisCard.tsx

import React from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/molecules/Button';
import { Input } from '@/components/atoms/Input';
import { CardHeader } from './CardHeader';
import type { LocalJogo } from '@/types/parametros-jogos.types';

interface LocaisCardProps {
  locais: LocalJogo[];
  novoLocal: string;
  editandoLocalId: string | null;
  nomeEditando: string;
  onNovoLocalChange: (valor: string) => void;
  onAdicionarLocal: () => void;
  onIniciarEdicao: (id: string, nome: string) => void;
  onSalvarEdicao: () => void;
  onCancelarEdicao: () => void;
  onNomeEditandoChange: (valor: string) => void;
  onRemoverLocal: (id: string) => void;
}

export function LocaisCard({
  locais,
  novoLocal,
  editandoLocalId,
  nomeEditando,
  onNovoLocalChange,
  onAdicionarLocal,
  onIniciarEdicao,
  onSalvarEdicao,
  onCancelarEdicao,
  onNomeEditandoChange,
  onRemoverLocal,
}: LocaisCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && novoLocal.trim()) {
      onAdicionarLocal();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nomeEditando.trim()) {
      onSalvarEdicao();
    } else if (e.key === 'Escape') {
      onCancelarEdicao();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 h-60 flex flex-col">
      <div className="flex items-center justify-between flex-linear-0 mb-3">
        <CardHeader
          icon={MapPin}
          iconColor="green"
          title="Locais de Jogo"
          subtitle="Adicione os locais disponíveis"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={onAdicionarLocal}
          disabled={!novoLocal.trim()}
          className="px-3!"
        >
          <Plus className="w-5 h-7" />
        </Button>
      </div>

      {/* Input para adicionar novo local */}
      <div className="flex gap-2 flex-linear-0 mb-3">
        <Input
          placeholder="Ex: Quadra Central"
          value={novoLocal}
          onChange={(e) => onNovoLocalChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
      </div>

      {/* Lista de locais */}
      {locais.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-2">
          {locais.map((local) => (
            <div
              key={local.id}
              className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100"
            >
              {editandoLocalId === local.id ? (
                <>
                  <Input
                    value={nomeEditando}
                    onChange={(e) => onNomeEditandoChange(e.target.value)}
                    onKeyPress={handleEditKeyPress}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSalvarEdicao}
                    className="px-2! text-green-600 hover:text-green-700"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelarEdicao}
                    className="px-2! text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-green-600 flex-linear-0" />
                  <span className="flex-1 text-sm font-medium text-green-900">
                    {local.nome}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onIniciarEdicao(local.id, local.nome)}
                    className="px-2!"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoverLocal(local.id)}
                    className="px-2! text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <MapPin className="w-12 h-12 mb-2 opacity-30" />
          <p className="text-sm">Nenhum local cadastrado</p>
          <p className="text-xs mt-1">Adicione pelo menos um local para continuar</p>
        </div>
      )}
    </div>
  );
}