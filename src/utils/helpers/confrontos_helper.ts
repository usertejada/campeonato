// src/utils/helpers/confrontos_helper.ts

import type { Team } from '@/types/team.types';
import { embaralhar } from '@/utils/common/array_utils';

export interface ConfrontoRealizado {
  timeA: string; // nome do time
  timeB: string; // nome do time
}

/**
 * Verifica se um confronto já foi realizado
 * @param confrontosRealizados - Lista de confrontos já realizados
 * @param timeA - Nome do primeiro time
 * @param timeB - Nome do segundo time
 * @returns true se o confronto já foi realizado
 */
export function confrontoJaRealizado(
  confrontosRealizados: ConfrontoRealizado[],
  timeA: string,
  timeB: string
): boolean {
  return confrontosRealizados.some(
    confronto =>
      (confronto.timeA === timeA && confronto.timeB === timeB) ||
      (confronto.timeA === timeB && confronto.timeB === timeA)
  );
}

/**
 * Gera todas as combinações possíveis de confrontos entre times
 * Filtra confrontos que já foram realizados
 * @param times - Lista de times
 * @param confrontosRealizados - Lista de confrontos já realizados
 * @returns Array de tuplas [timeA, timeB] com confrontos disponíveis
 */
export function gerarCombinacoesDisponiveis(
  times: Team[],
  confrontosRealizados: ConfrontoRealizado[]
): Array<[Team, Team]> {
  const combinacoes: Array<[Team, Team]> = [];

  for (let i = 0; i < times.length; i++) {
    for (let j = i + 1; j < times.length; j++) {
      const timeA = times[i];
      const timeB = times[j];

      // Só adiciona se o confronto ainda não foi realizado
      if (!confrontoJaRealizado(confrontosRealizados, timeA.name, timeB.name)) {
        combinacoes.push([timeA, timeB]);
      }
    }
  }

  return combinacoes;
}

/**
 * Seleciona partidas para o dia evitando times repetidos
 * Um time não pode jogar mais de uma vez no mesmo dia
 * @param combinacoesDisponiveis - Combinações disponíveis de confrontos
 * @param quantidadePartidas - Quantidade de partidas desejadas
 * @returns Array de tuplas [timeA, timeB] com partidas selecionadas
 */
export function selecionarPartidasDoDia(
  combinacoesDisponiveis: Array<[Team, Team]>,
  quantidadePartidas: number
): Array<[Team, Team]> {
  const partidasSelecionadas: Array<[Team, Team]> = [];
  const timesJogandoHoje = new Set<string>();
  const combinacoesEmbaralhadas = embaralhar(combinacoesDisponiveis);

  for (const [timeA, timeB] of combinacoesEmbaralhadas) {
    // Se já temos partidas suficientes, para
    if (partidasSelecionadas.length >= quantidadePartidas) {
      break;
    }

    // Verifica se nenhum dos times já está jogando hoje
    if (!timesJogandoHoje.has(timeA.name) && !timesJogandoHoje.has(timeB.name)) {
      partidasSelecionadas.push([timeA, timeB]);
      timesJogandoHoje.add(timeA.name);
      timesJogandoHoje.add(timeB.name);
    }
  }

  return partidasSelecionadas;
}

/**
 * Cria um objeto de confronto realizado
 * @param timeA - Nome do primeiro time
 * @param timeB - Nome do segundo time
 * @returns Objeto ConfrontoRealizado
 */
export function criarConfronto(timeA: string, timeB: string): ConfrontoRealizado {
  return { timeA, timeB };
}