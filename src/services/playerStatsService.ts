// src/services/playerStatsService.ts

import { jogosService } from '@/services/jogosService';
import type { Jogo } from '@/types/jogo.types';

export interface PlayerStats {
  totalGols: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  jogosDisputados: number;
}

class PlayerStatsService {
  /**
   * Calcula estatísticas de um jogador baseado em todos os jogos finalizados
   */
  calcularEstatisticas(playerId: string): PlayerStats {
    const jogos = jogosService.carregarJogos();
    const jogosFinalizados = jogos.filter(jogo => jogo.status === 'finalizado');

    let totalGols = 0;
    let cartoesAmarelos = 0;
    let cartoesVermelhos = 0;
    let jogosDisputados = 0;

    jogosFinalizados.forEach(jogo => {
      let jogadorParticipou = false;

      // Conta gols
      if (jogo.golsCasa) {
        const golsDoJogador = jogo.golsCasa.filter(gol => gol.jogadorId === playerId);
        totalGols += golsDoJogador.length;
        if (golsDoJogador.length > 0) jogadorParticipou = true;
      }

      if (jogo.golsVisitante) {
        const golsDoJogador = jogo.golsVisitante.filter(gol => gol.jogadorId === playerId);
        totalGols += golsDoJogador.length;
        if (golsDoJogador.length > 0) jogadorParticipou = true;
      }

      // Conta cartões
      if (jogo.cartoes) {
        jogo.cartoes.forEach(cartao => {
          if (cartao.jogadorId === playerId) {
            jogadorParticipou = true;
            if (cartao.tipo === 'amarelo') {
              cartoesAmarelos++;
            } else if (cartao.tipo === 'vermelho') {
              cartoesVermelhos++;
            }
          }
        });
      }

      // Incrementa jogos disputados se o jogador participou
      if (jogadorParticipou) {
        jogosDisputados++;
      }
    });

    return {
      totalGols,
      cartoesAmarelos,
      cartoesVermelhos,
      jogosDisputados,
    };
  }

  /**
   * Retorna estatísticas de múltiplos jogadores de uma vez
   */
  calcularEstatisticasMultiplos(playerIds: string[]): Map<string, PlayerStats> {
    const resultado = new Map<string, PlayerStats>();
    
    playerIds.forEach(id => {
      resultado.set(id, this.calcularEstatisticas(id));
    });

    return resultado;
  }
}

// Exporta instância única (Singleton)
export const playerStatsService = new PlayerStatsService();