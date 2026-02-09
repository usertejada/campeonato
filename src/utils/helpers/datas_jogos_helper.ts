// src/utils/helpers/datas_jogos_helper.ts

import type { ParametrosJogos } from '@/types/parametros-jogos.types';

/**
 * Formata data para ISO (YYYY-MM-DD)
 * @param date - Objeto Date
 * @returns String no formato YYYY-MM-DD
 */
export function formatarDataISO(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Obtém a próxima data disponível das datas selecionadas no calendário
 * Ignora datas já usadas
 * @param parametros - Parâmetros dos jogos
 * @param datasUsadas - Array de datas já usadas (YYYY-MM-DD)
 * @returns String com data disponível (YYYY-MM-DD) ou null
 */
export function obterProximaDataDisponivel(
  parametros: ParametrosJogos,
  datasUsadas: string[]
): string | null {
  // Usa datas selecionadas no calendário se disponíveis
  if (parametros.datasSelecionadas && parametros.datasSelecionadas.length > 0) {
    // Filtra datas que ainda não foram usadas
    const datasDisponiveis = parametros.datasSelecionadas
      .filter(data => !datasUsadas.includes(data))
      .sort(); // Ordena para usar a mais próxima primeiro

    return datasDisponiveis[0] || null;
  }

  // Fallback para dias da semana (compatibilidade com versão antiga)
  return calcularProximaDataPorDiaSemana(parametros, datasUsadas);
}

/**
 * Calcula a próxima data disponível baseada nos dias da semana ativos
 * (Método antigo - mantido para compatibilidade)
 * @param parametros - Parâmetros dos jogos
 * @param datasUsadas - Array de datas já usadas (YYYY-MM-DD)
 * @returns String com data disponível (YYYY-MM-DD)
 */
export function calcularProximaDataPorDiaSemana(
  parametros: ParametrosJogos,
  datasUsadas: string[]
): string {
  const hoje = new Date();

  // Mapeia dias da semana ativos (0 = domingo, 6 = sábado)
  const diasAtivos = new Set(
    parametros.diasSemana
      .filter(d => d.ativo)
      .map(d => {
        const map: Record<string, number> = {
          'domingo': 0,
          'segunda': 1,
          'terca': 2,
          'quarta': 3,
          'quinta': 4,
          'sexta': 5,
          'sabado': 6,
        };
        return map[d.id];
      })
  );

  // Busca o próximo dia ativo (começando de amanhã)
  const dataAtual = new Date(hoje);
  dataAtual.setDate(dataAtual.getDate() + 1);

  let tentativas = 0;
  while (tentativas < 14) {
    const diaSemana = dataAtual.getDay();
    const dataString = formatarDataISO(dataAtual);

    // Verifica se o dia está ativo E não foi usado ainda
    if (diasAtivos.has(diaSemana) && !datasUsadas.includes(dataString)) {
      return dataString;
    }

    dataAtual.setDate(dataAtual.getDate() + 1);
    tentativas++;
  }

  // Se não encontrar, usa amanhã
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  return formatarDataISO(amanha);
}

/**
 * Verifica se uma data está dentro do período do campeonato
 * @param data - Data a verificar (YYYY-MM-DD)
 * @param dataInicio - Data de início do campeonato (YYYY-MM-DD)
 * @param dataFim - Data de fim do campeonato (YYYY-MM-DD)
 * @returns true se a data está dentro do período
 */
export function dataEstaNoPeriodo(
  data: string,
  dataInicio: string,
  dataFim: string
): boolean {
  const dataObj = new Date(data);
  const inicioObj = new Date(dataInicio);
  const fimObj = new Date(dataFim);

  return dataObj >= inicioObj && dataObj <= fimObj;
}