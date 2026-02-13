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
  onAtualizarCartao: (index: number, campo: 'jogador' | 'jogadorId' | 'time', valor: string) => void;
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

  // Opções de times
  const opcoesTimes = [jogo.timeCasa.nome, jogo.timeVisitante.nome];

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
            const jogadoresDisponiveis = obterJogadoresDoTime(cartao.time);
            const opcoesJogadores = obterOpcoesJogadores(cartao.time);

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
                  <CustomSelect
                    label="Time"
                    value={cartao.time === 'casa' ? jogo.timeCasa.nome : jogo.timeVisitante.nome}
                    onChange={(valor) => {
                      const novoTime = valor === jogo.timeCasa.nome ? 'casa' : 'visitante';
                      // Ao mudar de time, limpa o jogador selecionado
                      onAtualizarCartao(index, 'time', novoTime);
                      onAtualizarCartao(index, 'jogador', '');
                    }}
                    options={opcoesTimes}
                    required
                  />
                </div>

                {/* Select do Jogador */}
                <div className="flex-1">
                  {jogadoresDisponiveis.length > 0 ? (
                    <CustomSelect
                      label="Jogador"
                      value={
                        cartao.jogadorId
                          ? (() => {
                              const jogador = jogadoresDisponiveis.find(j => j.id === cartao.jogadorId);
                              return jogador ? `${jogador.name} (#${jogador.shirtNumber})` : '';
                            })()
                          : ''
                      }
                      onChange={(valor) => {
                        console.log('Select cartão onChange:', valor);
                        // Busca o jogador pelo formato completo
                        const jogadorEncontrado = jogadoresDisponiveis.find(j => `${j.name} (#${j.shirtNumber})` === valor);
                        
                        if (jogadorEncontrado) {
                          console.log('Jogador do cartão encontrado:', jogadorEncontrado);
                          onAtualizarCartao(index, 'jogador', jogadorEncontrado.name);
                          setTimeout(() => {
                            onAtualizarCartao(index, 'jogadorId', jogadorEncontrado.id);
                          }, 0);
                        } else {
                          console.log('Jogador do cartão NÃO encontrado:', valor);
                        }
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