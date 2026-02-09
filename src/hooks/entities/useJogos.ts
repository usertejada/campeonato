// src/hooks/entities/useJogos.ts

import { useState, useMemo, useEffect } from 'react';
import { jogosService } from '@/services/jogosService';
import type { Jogo, FinalizarJogoData } from '@/types/jogo.types';
import type { Team } from '@/types/team.types';
import type { ParametrosJogos } from '@/types/parametros-jogos.types';
import type { ConfrontoRealizado } from '@/utils/helpers/confrontos_helper';

interface GerarJogosParams {
  times: Team[];
  parametros: ParametrosJogos;
}

export function useJogos() {
  // ========== ESTADOS ==========
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [confrontosRealizados, setConfrontosRealizados] = useState<ConfrontoRealizado[]>([]);
  const [datasUsadas, setDatasUsadas] = useState<string[]>([]);

  // ========== CARREGAMENTO INICIAL ==========
  useEffect(() => {
    const jogosCarregados = jogosService.carregarJogos();
    const confrontosCarregados = jogosService.carregarConfrontos();
    const datasCarregadas = jogosService.carregarDatasUsadas();

    setJogos(jogosCarregados);
    setConfrontosRealizados(confrontosCarregados);
    setDatasUsadas(datasCarregadas);
  }, []);

  // ========== SINCRONIZAÇÃO COM LOCALSTORAGE ==========
  
  // Salva jogos sempre que mudar
  useEffect(() => {
    if (jogos.length > 0) {
      jogosService.salvarJogos(jogos);
    }
  }, [jogos]);

  // Salva confrontos sempre que mudar
  useEffect(() => {
    if (confrontosRealizados.length > 0) {
      jogosService.salvarConfrontos(confrontosRealizados);
    }
  }, [confrontosRealizados]);

  // Salva datas usadas sempre que mudar
  useEffect(() => {
    jogosService.salvarDatasUsadas(datasUsadas);
  }, [datasUsadas]);

  // ========== OPÇÕES E FILTROS ==========

  const statusOptions = useMemo(
    () => ['Todos', 'Agendado', 'Ao Vivo', 'Finalizado'],
    []
  );

  const filteredJogos = useMemo(() => {
    return jogos.filter((jogo) => {
      // Filtro de status
      const matchStatus =
        statusFilter === 'Todos' ||
        (statusFilter === 'Agendado' && jogo.status === 'agendado') ||
        (statusFilter === 'Ao Vivo' && jogo.status === 'ao-vivo') ||
        (statusFilter === 'Finalizado' && jogo.status === 'finalizado');

      // Filtro de busca
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        jogo.timeCasa.nome.toLowerCase().includes(searchLower) ||
        jogo.timeVisitante.nome.toLowerCase().includes(searchLower) ||
        jogo.estadio.toLowerCase().includes(searchLower);

      return matchStatus && matchSearch;
    });
  }, [jogos, statusFilter, searchTerm]);

  // ========== GERAÇÃO DE JOGOS ==========

  const handleGerarAutomatico = (times: Team[], parametros: ParametrosJogos) => {
    try {
      const resultado = jogosService.gerarJogosDoDia(
        times,
        parametros,
        confrontosRealizados,
        datasUsadas
      );

      // Atualiza estados
      setJogos(prevJogos => [...prevJogos, ...resultado.jogos]);
      setConfrontosRealizados(prev => [...prev, ...resultado.novosConfrontos]);
      setDatasUsadas(prev => [...prev, resultado.dataUsada]);

      return {
        sucesso: true,
        quantidade: resultado.jogos.length,
        mensagem: `${resultado.jogos.length} jogos gerados para ${new Date(
          resultado.dataUsada + 'T00:00:00'
        ).toLocaleDateString('pt-BR')}!`,
      };
    } catch (error) {
      return {
        sucesso: false,
        quantidade: 0,
        mensagem: error instanceof Error ? error.message : 'Erro ao gerar jogos',
      };
    }
  };

  const handleAdicionarManual = () => {
    // TODO: Implementar modal de criação manual
    console.log('Abrir modal de criação manual');
  };

  // ========== FINALIZAR JOGO ==========

  const handleFinalizarJogo = (jogoId: string, dados: FinalizarJogoData) => {
    setJogos(prevJogos =>
      prevJogos.map(jogo =>
        jogo.id === jogoId
          ? {
              ...jogo,
              status: 'finalizado' as const,
              placarCasa: dados.placarCasa,
              placarVisitante: dados.placarVisitante,
              golsCasa: dados.golsCasa,
              golsVisitante: dados.golsVisitante,
              cartoes: dados.cartoes,
              relatorioArbitro: dados.relatorioArbitro,
            }
          : jogo
      )
    );
  };

  // ========== FUNÇÕES DE LIMPEZA ==========

  const limparJogos = () => {
    setJogos([]);
    setConfrontosRealizados([]);
    setDatasUsadas([]);
    jogosService.limparTudo();
  };

  const limparConfrontos = () => {
    setConfrontosRealizados([]);
    jogosService.limparConfrontos();
  };

  const limparDatasUsadas = () => {
    setDatasUsadas([]);
    jogosService.limparDatasUsadas();
  };

  const limparJogosAntigos = (quantidadeManter: number = 50) => {
    const jogosRecentes = jogosService.limparJogosAntigos(jogos, quantidadeManter);
    setJogos(jogosRecentes);
    jogosService.salvarJogos(jogosRecentes);
  };

  // ========== UTILITÁRIOS ==========

  const verificarEspacoLocalStorage = (): { usado: number; disponivel: number } => {
    return jogosService.verificarEspacoLocalStorage();
  };

  // ========== RETORNO ==========

  return {
    jogos,
    filteredJogos,
    searchTerm,
    statusFilter,
    statusOptions,
    confrontosRealizados,
    datasUsadas,
    setSearchTerm,
    setStatusFilter,
    handleGerarAutomatico,
    handleAdicionarManual,
    handleFinalizarJogo,
    limparJogos,
    limparConfrontos,
    limparDatasUsadas,
    limparJogosAntigos,
    verificarEspacoLocalStorage,
  };
}