// src/utils/helpers/horarios_helper.ts

import type { ConfiguracaoPartidas, TempoJogo } from '@/types/parametros-jogos.types';

/**
 * Calcula os horários das partidas baseado na configuração
 * @param config - Configuração das partidas (horário início, número, intervalo)
 * @param tempoJogo - Tempo de jogo (primeiro e segundo tempo)
 * @returns Array de horários formatados (HH:mm)
 */
export function calcularHorariosPartidas(
  config: ConfiguracaoPartidas,
  tempoJogo: TempoJogo
): string[] {
  const horarios: string[] = [];
  const { horarioInicio, numeroPartidas, intervaloEntreJogos } = config;
  const duracaoPartida = tempoJogo.primeiroTempo + tempoJogo.segundoTempo;

  // Converte horário inicial para minutos
  const [horaInicio, minutoInicio] = horarioInicio.split(':').map(Number);
  let minutosAcumulados = horaInicio * 60 + minutoInicio;

  // Define intervalo baseado na duração da partida
  const intervaloTotal = calcularIntervaloTotal(duracaoPartida, intervaloEntreJogos);

  for (let i = 0; i < numeroPartidas; i++) {
    const horas = Math.floor(minutosAcumulados / 60);
    const minutos = minutosAcumulados % 60;
    horarios.push(`${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`);
    
    // Adiciona intervalo para próxima partida
    minutosAcumulados += intervaloTotal;
  }

  return horarios;
}

/**
 * Calcula o intervalo total entre partidas baseado na duração
 * @param duracaoPartida - Duração total da partida em minutos
 * @param intervaloConfigurado - Intervalo configurado pelo usuário
 * @returns Intervalo total em minutos
 */
function calcularIntervaloTotal(duracaoPartida: number, intervaloConfigurado: number): number {
  if (duracaoPartida === 30) {
    // 15x15: SEM intervalo - próxima partida a cada 30 minutos
    return 30;
  } else if (duracaoPartida === 40) {
    // 20x20: SEM intervalo - próxima partida a cada 40 minutos
    return 40;
  } else if (duracaoPartida === 90) {
    // 45x45: COM intervalo - arredonda para 2 horas (120 minutos)
    return 120;
  } else {
    // Outros casos: usa duração + intervalo configurado
    return duracaoPartida + intervaloConfigurado;
  }
}

/**
 * Gera todas as datas dentro de um período
 * @param dataInicio - Data inicial (YYYY-MM-DD)
 * @param dataFim - Data final (YYYY-MM-DD)
 * @returns Array de datas em formato ISO (YYYY-MM-DD)
 */
export function gerarDatasNoPeriodo(dataInicio: string, dataFim: string): string[] {
  const datas: string[] = [];
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  const current = new Date(inicio);
  while (current <= fim) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    datas.push(`${year}-${month}-${day}`);
    
    current.setDate(current.getDate() + 1);
  }

  return datas;
}