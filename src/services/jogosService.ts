// src/services/jogosService.ts

import type { Jogo } from '@/types/jogo.types';
import type { Team } from '@/types/team.types';
import type { ParametrosJogos } from '@/types/parametros-jogos.types';
import { calcularHorariosPartidas } from '@/utils/helpers/horarios_helper';
import { obterProximaDataDisponivel } from '@/utils/helpers/datas_jogos_helper';
import {
  gerarCombinacoesDisponiveis,
  selecionarPartidasDoDia,
  criarConfronto,
  type ConfrontoRealizado,
} from '@/utils/helpers/confrontos_helper';

const STORAGE_KEY_JOGOS = 'jogos-gerados';
const STORAGE_KEY_CONFRONTOS = 'confrontos-realizados';
const STORAGE_KEY_DATAS_USADAS = 'datas-usadas';

/**
 * Service para gerenciar jogos, confrontos e datas no localStorage
 */
class JogosService {
  // ========== JOGOS ==========

  /**
   * Carrega jogos do localStorage
   */
  carregarJogos(): Jogo[] {
    if (typeof window === 'undefined') return [];

    try {
      const jogosSalvos = localStorage.getItem(STORAGE_KEY_JOGOS);
      return jogosSalvos ? JSON.parse(jogosSalvos) : [];
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      return [];
    }
  }

  /**
   * Salva jogos no localStorage
   */
  salvarJogos(jogos: Jogo[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY_JOGOS, JSON.stringify(jogos));
    } catch (error) {
      console.error('Erro ao salvar jogos (quota excedida):', error);
      // Se exceder quota, mantém apenas os 50 jogos mais recentes
      const jogosRecentes = jogos.slice(-50);
      try {
        localStorage.setItem(STORAGE_KEY_JOGOS, JSON.stringify(jogosRecentes));
      } catch (e) {
        console.error('Não foi possível salvar jogos mesmo reduzindo quantidade');
      }
    }
  }

  /**
   * Limpa todos os jogos
   */
  limparJogos(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_JOGOS);
  }

  /**
   * Remove jogos antigos mantendo apenas os mais recentes
   */
  limparJogosAntigos(jogos: Jogo[], quantidadeManter: number = 50): Jogo[] {
    return jogos.slice(-quantidadeManter);
  }

  // ========== CONFRONTOS ==========

  /**
   * Carrega confrontos realizados do localStorage
   */
  carregarConfrontos(): ConfrontoRealizado[] {
    if (typeof window === 'undefined') return [];

    try {
      const confrontosSalvos = localStorage.getItem(STORAGE_KEY_CONFRONTOS);
      return confrontosSalvos ? JSON.parse(confrontosSalvos) : [];
    } catch (error) {
      console.error('Erro ao carregar confrontos:', error);
      return [];
    }
  }

  /**
   * Salva confrontos no localStorage
   */
  salvarConfrontos(confrontos: ConfrontoRealizado[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY_CONFRONTOS, JSON.stringify(confrontos));
    } catch (error) {
      console.error('Erro ao salvar confrontos:', error);
    }
  }

  /**
   * Limpa todos os confrontos
   */
  limparConfrontos(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_CONFRONTOS);
  }

  // ========== DATAS USADAS ==========

  /**
   * Carrega datas usadas do localStorage
   */
  carregarDatasUsadas(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const datasUsadasSalvas = localStorage.getItem(STORAGE_KEY_DATAS_USADAS);
      return datasUsadasSalvas ? JSON.parse(datasUsadasSalvas) : [];
    } catch (error) {
      console.error('Erro ao carregar datas usadas:', error);
      return [];
    }
  }

  /**
   * Salva datas usadas no localStorage
   */
  salvarDatasUsadas(datas: string[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY_DATAS_USADAS, JSON.stringify(datas));
    } catch (error) {
      console.error('Erro ao salvar datas usadas:', error);
    }
  }

  /**
   * Limpa datas usadas
   */
  limparDatasUsadas(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_DATAS_USADAS);
  }

  // ========== LÓGICA DE GERAÇÃO ==========

  /**
   * Cria os objetos Jogo a partir das partidas selecionadas
   */
  criarJogos(
    partidas: Array<[Team, Team]>,
    parametros: ParametrosJogos,
    data: string
  ): Jogo[] {
    const jogosGerados: Jogo[] = [];

    if (!parametros.configuracaoPartidas || !parametros.tempoJogo) {
      return [];
    }

    const horarios = calcularHorariosPartidas(
      parametros.configuracaoPartidas,
      parametros.tempoJogo
    );
    const locais = parametros.locais;

    if (horarios.length === 0 || locais.length === 0) {
      return [];
    }

    partidas.forEach(([timeCasa, timeVisitante], index) => {
      const horarioIndex = index % horarios.length;
      const localIndex = index % locais.length;

      const jogo: Jogo = {
        id: `jogo-${Date.now()}-${index}`,
        timeCasa: {
          nome: timeCasa.name,
          escudo: timeCasa.logo || '/assets/images/shields/default.svg',
        },
        timeVisitante: {
          nome: timeVisitante.name,
          escudo: timeVisitante.logo || '/assets/images/shields/default.svg',
        },
        placarCasa: null,
        placarVisitante: null,
        estadio: locais[localIndex].nome,
        data: data,
        horario: horarios[horarioIndex],
        status: 'agendado',
      };

      jogosGerados.push(jogo);
    });

    return jogosGerados;
  }

  /**
   * Gera jogos para a próxima data disponível
   * @returns Objeto com jogos gerados, confrontos e data usada
   */
  gerarJogosDoDia(
    times: Team[],
    parametros: ParametrosJogos,
    confrontosRealizados: ConfrontoRealizado[],
    datasUsadas: string[]
  ): {
    jogos: Jogo[];
    novosConfrontos: ConfrontoRealizado[];
    dataUsada: string;
  } {
    // Validações
    if (!parametros.campeonato) {
      throw new Error('Nenhum campeonato selecionado');
    }

    if (!parametros.configuracaoPartidas) {
      throw new Error('Configure os parâmetros de partidas');
    }

    if (times.length < 2) {
      throw new Error('É necessário pelo menos 2 times para gerar jogos');
    }

    // Filtra times do campeonato selecionado
    const timesDoChampionship = times.filter(
      time => time.championshipName === parametros.campeonato?.nome
    );

    if (timesDoChampionship.length < 2) {
      throw new Error(
        `O campeonato "${parametros.campeonato.nome}" precisa ter pelo menos 2 times`
      );
    }

    // Gera combinações disponíveis (que ainda não foram realizadas)
    const combinacoesDisponiveis = gerarCombinacoesDisponiveis(
      timesDoChampionship,
      confrontosRealizados
    );

    if (combinacoesDisponiveis.length === 0) {
      throw new Error(
        'Todos os confrontos possíveis já foram realizados! O campeonato está completo.'
      );
    }

    // Obtém a próxima data disponível
    const proximaData = obterProximaDataDisponivel(parametros, datasUsadas);

    if (!proximaData) {
      throw new Error('Nenhuma data disponível! Selecione mais datas no calendário.');
    }

    // Seleciona partidas do dia (evitando times repetidos no mesmo dia)
    const quantidadePartidas = parametros.configuracaoPartidas.numeroPartidas;
    const partidasDoDia = selecionarPartidasDoDia(combinacoesDisponiveis, quantidadePartidas);

    if (partidasDoDia.length === 0) {
      throw new Error('Não foi possível gerar partidas. Tente novamente ou ajuste os parâmetros.');
    }

    // Cria os jogos
    const novosJogos = this.criarJogos(partidasDoDia, parametros, proximaData);

    // Cria confrontos realizados
    const novosConfrontos = partidasDoDia.map(([timeA, timeB]) =>
      criarConfronto(timeA.name, timeB.name)
    );

    return {
      jogos: novosJogos,
      novosConfrontos,
      dataUsada: proximaData,
    };
  }

  // ========== UTILITÁRIOS ==========

  /**
   * Verifica espaço usado no localStorage
   */
  verificarEspacoLocalStorage(): { usado: number; disponivel: number } {
    if (typeof window === 'undefined') {
      return { usado: 0, disponivel: 0 };
    }

    let usado = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        usado += localStorage[key].length + key.length;
      }
    }
    const disponivel = 5242880; // 5MB em bytes (aproximado)
    return { usado, disponivel };
  }

  /**
   * Limpa todos os dados relacionados a jogos
   */
  limparTudo(): void {
    this.limparJogos();
    this.limparConfrontos();
    this.limparDatasUsadas();
  }
}

// Exporta instância única (Singleton)
export const jogosService = new JogosService();