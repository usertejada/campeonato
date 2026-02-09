// src/services/parametrosJogosService.ts

import type {
  ParametrosJogos,
  LocalJogo,
  TempoJogo,
  ConfiguracaoPartidas,
  DiaSemana,
  CampeonatoSelecionado,
} from '@/types/parametros-jogos.types';
import { DIAS_SEMANA_PRESET } from '@/types/parametros-jogos.types';

const STORAGE_KEY = 'parametros-jogos';
const STORAGE_KEY_DATAS_USADAS = 'datas-usadas';

/**
 * Service para gerenciar parâmetros de jogos no localStorage
 */
class ParametrosJogosService {
  /**
   * Carrega parâmetros do localStorage
   */
  carregarParametros(): ParametrosJogos {
    if (typeof window === 'undefined') {
      return this.getParametrosVazios();
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return this.getParametrosVazios();
      }

      const parsed = JSON.parse(saved);
      
      // Garante que datasSelecionadas existe (compatibilidade com versões antigas)
      if (!parsed.datasSelecionadas) {
        parsed.datasSelecionadas = [];
      }

      return parsed;
    } catch (error) {
      console.error('Erro ao carregar parâmetros:', error);
      return this.getParametrosVazios();
    }
  }

  /**
   * Salva parâmetros no localStorage
   */
  salvarParametros(parametros: ParametrosJogos): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parametros));
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
    }
  }

  /**
   * Retorna parâmetros vazios/padrão
   */
  getParametrosVazios(): ParametrosJogos {
    return {
      campeonato: null,
      locais: [],
      tempoJogo: null,
      configuracaoPartidas: null,
      diasSemana: DIAS_SEMANA_PRESET,
      datasSelecionadas: [],
    };
  }

  /**
   * Verifica se os parâmetros estão completos
   */
  parametrosCompletos(parametros: ParametrosJogos): boolean {
    if (!parametros.campeonato) return false;
    if (parametros.locais.length === 0) return false;
    if (!parametros.tempoJogo) return false;
    if (!parametros.configuracaoPartidas) return false;
    if (
      !parametros.configuracaoPartidas.horarioInicio ||
      parametros.configuracaoPartidas.numeroPartidas <= 0
    ) {
      return false;
    }

    // Verifica se tem pelo menos uma data selecionada OU um dia da semana ativo
    const temDatasSelecionadas =
      parametros.datasSelecionadas && parametros.datasSelecionadas.length > 0;
    const temDiasSemanaAtivos = parametros.diasSemana.some((dia) => dia.ativo);

    if (!temDatasSelecionadas && !temDiasSemanaAtivos) return false;

    return true;
  }

  /**
   * Carrega datas que já foram usadas na geração de jogos
   */
  carregarDatasUsadas(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const datasUsadasStr = localStorage.getItem(STORAGE_KEY_DATAS_USADAS);
      return datasUsadasStr ? JSON.parse(datasUsadasStr) : [];
    } catch (error) {
      console.error('Erro ao carregar datas usadas:', error);
      return [];
    }
  }

  /**
   * Remove datas usadas das datas selecionadas
   */
  sincronizarDatasUsadas(parametros: ParametrosJogos): ParametrosJogos {
    const datasUsadas = this.carregarDatasUsadas();

    if (
      datasUsadas.length === 0 ||
      !parametros.datasSelecionadas ||
      parametros.datasSelecionadas.length === 0
    ) {
      return parametros;
    }

    const datasFiltradas = parametros.datasSelecionadas.filter(
      (data) => !datasUsadas.includes(data)
    );

    // Só retorna novo objeto se houver mudança
    if (datasFiltradas.length !== parametros.datasSelecionadas.length) {
      return {
        ...parametros,
        datasSelecionadas: datasFiltradas,
      };
    }

    return parametros;
  }

  // ========== CAMPEONATO ==========
  
  selecionarCampeonato(
    parametros: ParametrosJogos,
    campeonato: CampeonatoSelecionado
  ): ParametrosJogos {
    return {
      ...parametros,
      campeonato,
      datasSelecionadas: [], // Limpa as datas ao trocar de campeonato
    };
  }

  removerCampeonato(parametros: ParametrosJogos): ParametrosJogos {
    return {
      ...parametros,
      campeonato: null,
      datasSelecionadas: [],
    };
  }

  // ========== LOCAIS ==========

  adicionarLocal(parametros: ParametrosJogos, nome: string): ParametrosJogos {
    const novoLocal: LocalJogo = {
      id: `local-${Date.now()}`,
      nome: nome.trim(),
    };

    return {
      ...parametros,
      locais: [...parametros.locais, novoLocal],
    };
  }

  removerLocal(parametros: ParametrosJogos, id: string): ParametrosJogos {
    return {
      ...parametros,
      locais: parametros.locais.filter((local) => local.id !== id),
    };
  }

  editarLocal(parametros: ParametrosJogos, id: string, novoNome: string): ParametrosJogos {
    return {
      ...parametros,
      locais: parametros.locais.map((local) =>
        local.id === id ? { ...local, nome: novoNome.trim() } : local
      ),
    };
  }

  // ========== TEMPO DE JOGO ==========

  selecionarTempoJogo(parametros: ParametrosJogos, tempo: TempoJogo): ParametrosJogos {
    return {
      ...parametros,
      tempoJogo: tempo,
    };
  }

  // ========== CONFIGURAÇÃO DE PARTIDAS ==========

  configurarPartidas(
    parametros: ParametrosJogos,
    config: ConfiguracaoPartidas
  ): ParametrosJogos {
    return {
      ...parametros,
      configuracaoPartidas: config,
    };
  }

  // ========== DIAS DA SEMANA ==========

  toggleDiaSemana(parametros: ParametrosJogos, id: string): ParametrosJogos {
    return {
      ...parametros,
      diasSemana: parametros.diasSemana.map((dia) =>
        dia.id === id ? { ...dia, ativo: !dia.ativo } : dia
      ),
    };
  }

  // ========== DATAS SELECIONADAS ==========

  toggleDataSelecionada(parametros: ParametrosJogos, dateString: string): ParametrosJogos {
    const datasSelecionadas = parametros.datasSelecionadas || [];

    if (datasSelecionadas.includes(dateString)) {
      // Remove a data se já estiver selecionada
      return {
        ...parametros,
        datasSelecionadas: datasSelecionadas.filter((d) => d !== dateString),
      };
    } else {
      // Adiciona a data se não estiver selecionada
      return {
        ...parametros,
        datasSelecionadas: [...datasSelecionadas, dateString].sort(),
      };
    }
  }

  limparDatasSelecionadas(parametros: ParametrosJogos): ParametrosJogos {
    return {
      ...parametros,
      datasSelecionadas: [],
    };
  }
}

// Exporta instância única (Singleton)
export const parametrosJogosService = new ParametrosJogosService();