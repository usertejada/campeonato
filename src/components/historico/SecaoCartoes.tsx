// src/components/historico/SecaoCartoes.tsx

import React, { useMemo } from 'react';
import { Button } from '@/components/molecules/Button';
import { CustomSelect } from '@/components/atoms/CustomSelect';
import { X } from 'lucide-react';
import type { Cartao, Jogo } from '@/types/jogo.types';
import type { Player } from '@/types/player.types';

interface SecaoCartoesProps {
  jogo: Jogo;
  cartoes: Cartao[];
  jogadoresTimeCasa: Player[];
  jogadoresTimeVisitante: Player[];
  onAdicionarCartao: (tipo: 'amarelo' | 'vermelho') => void;
  onAtualizarCartao: (index: number, campo: 'jogador' | 'time', valor: string) => void;
  onRemoverCartao: (index: number) => void;
}

export function SecaoCartoes({
  jogo,
  cartoes,
  jogadoresTimeCasa,
  jogadoresTimeVisitante,
  onAdicionarCartao,
  onAtualizarCartao,
  onRemoverCartao,
}: SecaoCartoesProps) {
  
  // Função para obter jogadores baseado no time selecionado
  const obterJogadoresDoTime = (timeCartao: 'casa' | 'visitante'): Player[] => {
    return timeCartao === 'casa' ? jogadoresTimeCasa : jogadoresTimeVisitante;
  };

  // Cria opções de jogadores para cada cartão
  const obterOpcoesJogadores = (timeCartao: 'casa' | 'visitante'): string[] => {
    const jogadores = obterJogadoresDoTime(timeCartao);
    return jogadores.map(j => `${j.name} (#${j.shirtNumber})`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Cartões</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdicionarCartao('amarelo')}
          >
            <span className="text-yellow-500 mr-1">🟨</span>
            Amarelo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdicionarCartao('vermelho')}
          >
            <span className="text-red-500 mr-1">🟥</span>
            Vermelho
          </Button>
        </div>
      </div>

      {cartoes.length > 0 ? (
        <div className="space-y-2">
          {cartoes.map((cartao, index) => {
            const opcoesJogadores = obterOpcoesJogadores(cartao.time);
            const jogadoresDisponiveis = obterJogadoresDoTime(cartao.time);

            return (
              <div key={index} className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded">
                  {cartao.tipo === 'amarelo' ? (
                    <span className="text-2xl">🟨</span>
                  ) : (
                    <span className="text-2xl">🟥</span>
                  )}
                </div>
                
                {/* Select do Time */}
                <div className="flex-1">
                  <label className="block text-[12px] font-medium text-gray-500 mb-1 ml-0.5">
                    Time
                  </label>
                  <select
                    value={cartao.time}
                    onChange={(e) => {
                      // Ao mudar de time, limpa o jogador selecionado
                      onAtualizarCartao(index, 'time', e.target.value);
                      onAtualizarCartao(index, 'jogador', '');
                    }}
                    className="w-full px-3 py-2 bg-gray-100/50 border border-gray-300 focus:border-blue-400 focus:bg-white rounded-xl text-[14px] text-gray-900 outline-none transition-all"
                  >
                    <option value="casa">{jogo.timeCasa.nome}</option>
                    <option value="visitante">{jogo.timeVisitante.nome}</option>
                  </select>
                </div>

                {/* Select do Jogador */}
                <div className="flex-1">
                  {jogadoresDisponiveis.length > 0 ? (
                    <CustomSelect
                      label="Jogador"
                      value={cartao.jogador ? `${cartao.jogador} (#${jogadoresDisponiveis.find(j => j.name === cartao.jogador)?.shirtNumber || ''})` : ''}
                      onChange={(valor) => {
                        // Extrai apenas o nome (remove o número da camisa)
                        const nome = valor.replace(/\s*\(#\d+\)$/, '');
                        onAtualizarCartao(index, 'jogador', nome);
                      }}
                      options={opcoesJogadores}
                      placeholder="Selecione o jogador"
                      required
                    />
                  ) : (
                    <div>
                      <label className="block text-[12px] font-medium text-gray-500 mb-1 ml-0.5">
                        Jogador
                      </label>
                      <div className="w-full px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-xl text-[12px] text-yellow-700">
                        Nenhum jogador ativo neste time
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onRemoverCartao(index)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                  aria-label="Remover cartão"
                >
                  <X size={20} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhum cartão registrado
        </p>
      )}
    </div>
  );
}