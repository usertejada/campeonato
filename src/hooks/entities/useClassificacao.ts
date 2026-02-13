// src/hooks/entities/useClassificacao.ts

import { useState, useEffect, useMemo } from 'react';
import { teamService } from '@/services/teamService';
import { jogosService } from '@/services/jogosService';
import type { Team } from '@/types/team.types';
import type { Jogo } from '@/types/jogo.types';

export interface EstatisticaTime {
  time: Team;
  posicao: number;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
  aproveitamento: number;
  ultimosJogos: ('V' | 'E' | 'D')[]; // Últimos 5 jogos
}

export function useClassificacao() {
  const [times, setTimes] = useState<Team[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [championshipFilter, setChampionshipFilter] = useState<string>('Todos os Campeonatos');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega times e jogos
  useEffect(() => {
    const loadData = () => {
      const allTeams = teamService.getAll();
      const allJogos = jogosService.carregarJogos();
      setTimes(allTeams);
      setJogos(allJogos);
      setIsLoading(false);
    };

    loadData();

    // Listener para atualizar quando houver mudanças no localStorage
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Lista de campeonatos para o filtro
  const championshipOptions = useMemo(() => {
    return teamService.getChampionshipNames();
  }, [times]);

  // Calcula estatísticas de cada time
  const classificacao = useMemo(() => {
    // Filtra times por campeonato
    const timesFiltrados = championshipFilter === 'Todos os Campeonatos'
      ? times
      : times.filter(t => t.championshipName === championshipFilter);

    // Filtra jogos finalizados do campeonato
    const jogosFiltrados = jogos.filter(jogo => {
      if (jogo.status !== 'finalizado') return false;
      if (championshipFilter === 'Todos os Campeonatos') return true;
      
      // Verifica se algum dos times do jogo pertence ao campeonato filtrado
      const timeCasaPertence = timesFiltrados.some(t => t.name === jogo.timeCasa.nome);
      const timeVisitantePertence = timesFiltrados.some(t => t.name === jogo.timeVisitante.nome);
      
      return timeCasaPertence || timeVisitantePertence;
    });

    // Calcula estatísticas para cada time
    const estatisticas: EstatisticaTime[] = timesFiltrados.map(time => {
      let pontos = 0;
      let jogosCount = 0;
      let vitorias = 0;
      let empates = 0;
      let derrotas = 0;
      let golsPro = 0;
      let golsContra = 0;
      const ultimosJogos: ('V' | 'E' | 'D')[] = [];

      // Percorre todos os jogos finalizados
      jogosFiltrados.forEach(jogo => {
        const ehTimeCasa = jogo.timeCasa.nome === time.name;
        const ehTimeVisitante = jogo.timeVisitante.nome === time.name;

        // Só conta se o time participou do jogo
        if (!ehTimeCasa && !ehTimeVisitante) return;

        jogosCount++;

        const placarCasa = jogo.placarCasa ?? 0;
        const placarVisitante = jogo.placarVisitante ?? 0;

        if (ehTimeCasa) {
          golsPro += placarCasa;
          golsContra += placarVisitante;

          if (placarCasa > placarVisitante) {
            vitorias++;
            pontos += 3;
            ultimosJogos.unshift('V');
          } else if (placarCasa === placarVisitante) {
            empates++;
            pontos += 1;
            ultimosJogos.unshift('E');
          } else {
            derrotas++;
            ultimosJogos.unshift('D');
          }
        } else if (ehTimeVisitante) {
          golsPro += placarVisitante;
          golsContra += placarCasa;

          if (placarVisitante > placarCasa) {
            vitorias++;
            pontos += 3;
            ultimosJogos.unshift('V');
          } else if (placarVisitante === placarCasa) {
            empates++;
            pontos += 1;
            ultimosJogos.unshift('E');
          } else {
            derrotas++;
            ultimosJogos.unshift('D');
          }
        }
      });

      const saldoGols = golsPro - golsContra;
      const aproveitamento = jogosCount > 0 ? (pontos / (jogosCount * 3)) * 100 : 0;

      return {
        time,
        posicao: 0, // Será calculado após ordenação
        pontos,
        jogos: jogosCount,
        vitorias,
        empates,
        derrotas,
        golsPro,
        golsContra,
        saldoGols,
        aproveitamento,
        ultimosJogos: ultimosJogos.slice(0, 5), // Últimos 5 jogos
      };
    });

    // Ordena por: Pontos > Vitórias > Saldo > Gols Pró
    estatisticas.sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
      if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;
      return b.golsPro - a.golsPro;
    });

    // Define as posições
    estatisticas.forEach((est, index) => {
      est.posicao = index + 1;
    });

    return estatisticas;
  }, [times, jogos, championshipFilter]);

  return {
    classificacao,
    championshipFilter,
    championshipOptions,
    setChampionshipFilter,
    isLoading,
  };
}