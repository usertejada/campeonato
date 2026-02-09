// src/services/teamService.ts
import { LocalStorageService } from './localStorageService';
import { generateUniqueIdWithCheck } from '../utils/common/id.utils';
import { championshipService } from './championshipService';
import type { Team } from '../types/team.types';

class TeamService extends LocalStorageService<Team> {
  constructor() {
    super('champion_system_teams');
  }

  /**
   * Busca times por campeonato
   */
  getByChampionship(championshipId: string): Team[] {
    if (championshipId === 'Todos os Campeonatos') return this.getAll();
    return this.getAll().filter(team => team.championshipId === championshipId);
  }

  /**
   * Adiciona um novo time com ID único garantido
   */
  addTeam(data: Omit<Team, 'id'>): Team {
    const newTeam: Team = {
      ...data,
      id: generateUniqueIdWithCheck(this.getAll(), 'team'),
      coach: data.coach ?? '',
      email: data.email ?? '',
      players: data.players ?? 0,
      foundedYear: data.foundedYear ?? new Date().getFullYear(),
      isActive: data.isActive ?? true,
    };
    return this.add(newTeam);
  }

  /**
   * Retorna lista de nomes de campeonatos que possuem times
   */
  getChampionshipNames(): string[] {
    const championships = championshipService.getAll();
    const names = championships.map((c) => c.name);
    return ['Todos os Campeonatos', ...names];
  }

  /**
   * Busca o ID do campeonato pelo nome
   */
  getChampionshipIdByName(name: string): string {
    const championships = championshipService.getAll();
    const championship = championships.find(c => c.name === name);
    return championship?.id || '';
  }

  /**
   * Popula dados de exemplo
   */
  seedData(): void {
    if (!this.isEmpty()) return;

    const championships = championshipService.getAll();
    if (championships.length === 0) return;

    const exampleTeams: Team[] = [
      {
        id: 'team_1',
        name: 'Astro Rei FC',
        logo: 'AR',
        championshipId: championships[0].id,
        championshipName: championships[0].name,
        coach: 'Anderson Tejada',
        email: 'astroreifc@email.com',
        phone: '(11) 98765-4321',
        players: 10,
        foundedYear: 2023,
        isActive: true,
      },
      {
        id: 'team_2',
        name: 'Lakers Unidos',
        logo: 'LU',
        championshipId: championships[0].id,
        championshipName: championships[0].name,
        coach: 'Carlos Silva',
        email: 'contato@lakersunidos.com.br',
        phone: '(11) 91234-5678',
        players: 12,
        foundedYear: 2015,
        isActive: true,
      },
      {
        id: 'team_3',
        name: 'Corinthians',
        logo: 'C',
        championshipId: championships[1]?.id || championships[0].id,
        championshipName: championships[1]?.name || championships[0].name,
        coach: 'Mano Menezes',
        email: 'contato@corinthians.com.br',
        phone: '(11) 2095-1910',
        players: 26,
        foundedYear: 1910,
        isActive: true,
      },
      {
        id: 'team_4',
        name: 'Palmeiras',
        logo: 'P',
        championshipId: championships[1]?.id || championships[0].id,
        championshipName: championships[1]?.name || championships[0].name,
        coach: 'Abel Ferreira',
        email: 'contato@palmeiras.com.br',
        phone: '(11) 3874-6600',
        players: 28,
        foundedYear: 1914,
        isActive: true,
      },
      {
        id: 'team_5',
        name: 'Flamengo',
        logo: 'F',
        championshipId: championships[1]?.id || championships[0].id,
        championshipName: championships[1]?.name || championships[0].name,
        coach: 'Tite',
        email: 'contato@flamengo.com.br',
        phone: '(21) 2569-2900',
        players: 25,
        foundedYear: 1895,
        isActive: true,
      },
      {
        id: 'team_6',
        name: 'Fluminense',
        logo: 'F',
        championshipId: championships[1]?.id || championships[0].id,
        championshipName: championships[1]?.name || championships[0].name,
        coach: 'Tite',
        email: 'contato@flamengo.com.br',
        phone: '(21) 2569-2900',
        players: 25,
        foundedYear: 1895,
        isActive: true,
      },
    ];

    exampleTeams.forEach((team) => this.add(team));
  }
}

// Exporta instância única (Singleton)
export const teamService = new TeamService();