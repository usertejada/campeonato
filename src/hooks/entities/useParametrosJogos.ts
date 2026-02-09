// src/hooks/entities/useParametrosJogos.ts

import { useState, useEffect } from 'react';
import { parametrosJogosService } from '@/services/parametrosJogosService';
import { calcularHorariosPartidas, gerarDatasNoPeriodo } from '@/utils/helpers/horarios_helper';
import type {
  ParametrosJogos,
  TempoJogo,
  ConfiguracaoPartidas,
  CampeonatoSelecionado,
} from '@/types/parametros-jogos.types';
import { TEMPOS_JOGO_PRESET } from '@/types/parametros-jogos.types';

export function useParametrosJogos() {
  const [parametros, setParametros] = useState<ParametrosJogos>(
    parametrosJogosService.getParametrosVazios()
  );

  // Carrega parâmetros salvos do localStorage na montagem
  useEffect(() => {
    const parametrosCarregados = parametrosJogosService.carregarParametros();
    setParametros(parametrosCarregados);
  }, []);

  // Sincroniza com datas usadas - remove datas já utilizadas na geração de jogos
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setParametros((prev) => {
        const parametrosSincronizados = parametrosJogosService.sincronizarDatasUsadas(prev);
        
        // Só salva e atualiza se houve mudança
        if (parametrosSincronizados !== prev) {
          parametrosJogosService.salvarParametros(parametrosSincronizados);
          return parametrosSincronizados;
        }
        
        return prev;
      });
    }, 1000); // Verifica a cada 1 segundo

    return () => clearInterval(syncInterval);
  }, []);

  // Função auxiliar para atualizar e salvar
  const atualizarParametros = (novosParametros: ParametrosJogos) => {
    setParametros(novosParametros);
    parametrosJogosService.salvarParametros(novosParametros);
  };

  // ========== FUNÇÕES PÚBLICAS ==========

  /**
   * Verifica se os parâmetros estão completos
   */
  const parametrosCompletos = (): boolean => {
    return parametrosJogosService.parametrosCompletos(parametros);
  };

  /**
   * Calcula os horários das partidas baseado na configuração atual
   */
  const calcularHorarios = (): string[] => {
    if (!parametros.configuracaoPartidas || !parametros.tempoJogo) {
      return [];
    }
    return calcularHorariosPartidas(parametros.configuracaoPartidas, parametros.tempoJogo);
  };

  // ========== CAMPEONATO ==========

  const selecionarCampeonato = (campeonato: CampeonatoSelecionado) => {
    const novosParametros = parametrosJogosService.selecionarCampeonato(parametros, campeonato);
    atualizarParametros(novosParametros);
  };

  const removerCampeonato = () => {
    const novosParametros = parametrosJogosService.removerCampeonato(parametros);
    atualizarParametros(novosParametros);
  };

  // ========== LOCAIS ==========

  const adicionarLocal = (nome: string) => {
    const novosParametros = parametrosJogosService.adicionarLocal(parametros, nome);
    atualizarParametros(novosParametros);
  };

  const removerLocal = (id: string) => {
    const novosParametros = parametrosJogosService.removerLocal(parametros, id);
    atualizarParametros(novosParametros);
  };

  const editarLocal = (id: string, novoNome: string) => {
    const novosParametros = parametrosJogosService.editarLocal(parametros, id, novoNome);
    atualizarParametros(novosParametros);
  };

  // ========== TEMPO DE JOGO ==========

  const selecionarTempoJogo = (tempo: TempoJogo) => {
    const novosParametros = parametrosJogosService.selecionarTempoJogo(parametros, tempo);
    atualizarParametros(novosParametros);
  };

  // ========== CONFIGURAÇÃO DE PARTIDAS ==========

  const configurarPartidas = (config: ConfiguracaoPartidas) => {
    const novosParametros = parametrosJogosService.configurarPartidas(parametros, config);
    atualizarParametros(novosParametros);
  };

  // ========== DIAS DA SEMANA ==========

  const toggleDiaSemana = (id: string) => {
    const novosParametros = parametrosJogosService.toggleDiaSemana(parametros, id);
    atualizarParametros(novosParametros);
  };

  // ========== DATAS SELECIONADAS ==========

  const toggleDataSelecionada = (dateString: string) => {
    const novosParametros = parametrosJogosService.toggleDataSelecionada(parametros, dateString);
    atualizarParametros(novosParametros);
  };

  const limparDatasSelecionadas = () => {
    const novosParametros = parametrosJogosService.limparDatasSelecionadas(parametros);
    atualizarParametros(novosParametros);
  };

  const selecionarTodasDatasNoPeriodo = () => {
    if (!parametros.campeonato?.dataInicio || !parametros.campeonato?.dataFim) {
      return;
    }

    const datas = gerarDatasNoPeriodo(
      parametros.campeonato.dataInicio,
      parametros.campeonato.dataFim
    );

    const novosParametros = {
      ...parametros,
      datasSelecionadas: datas,
    };
    atualizarParametros(novosParametros);
  };

  // ========== RESET ==========

  const resetarParametros = () => {
    const parametrosVazios = parametrosJogosService.getParametrosVazios();
    atualizarParametros(parametrosVazios);
  };

  // ========== RETORNO ==========

  return {
    parametros,
    parametrosCompletos,
    temposJogoPreset: TEMPOS_JOGO_PRESET,
    calcularHorariosPartidas: calcularHorarios,

    // Campeonato
    selecionarCampeonato,
    removerCampeonato,

    // Locais
    adicionarLocal,
    removerLocal,
    editarLocal,

    // Tempo
    selecionarTempoJogo,

    // Configuração de Partidas
    configurarPartidas,

    // Dias da Semana
    toggleDiaSemana,

    // Datas Selecionadas
    toggleDataSelecionada,
    limparDatasSelecionadas,
    selecionarTodasDatasNoPeriodo,

    // Reset
    resetarParametros,
  };
}