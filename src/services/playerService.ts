// src/services/playerService.ts
import { LocalStorageService } from '@/services/localStorageService';
import { generateUniqueIdWithCheck } from '@/utils/common/id.utils';
import { teamService } from '@/services/teamService';
import type { Player } from '@/types/player.types';

class PlayerService extends LocalStorageService<Player> {
  constructor() {
    super('champion_system_players');
  }

  /**
   * Busca jogadores por time
   */
  getByTeam(teamId: string): Player[] {
    if (teamId === 'Todos os Times') return this.getAll();
    return this.getAll().filter(player => player.teamId === teamId);
  }

  /**
   * Adiciona um novo jogador com ID único garantido
   */
  addPlayer(data: Omit<Player, 'id'>): Player {
    const newPlayer: Player = {
      ...data,
      id: generateUniqueIdWithCheck(this.getAll(), 'player'),
      isActive: data.isActive ?? true,
    };
    return this.add(newPlayer);
  }

  /**
   * Retorna lista de nomes de times que possuem jogadores
   */
  getTeamNames(): string[] {
    const teams = teamService.getAll();
    const names = teams.map((t) => t.name);
    return ['Todos os Times', ...names];
  }

  /**
   * Busca o ID do time pelo nome
   */
  getTeamIdByName(name: string): string {
    const teams = teamService.getAll();
    const team = teams.find(t => t.name === name);
    return team?.id || '';
  }

  /**
   * Popula dados de exemplo
   */
  seedData(): void {
    if (!this.isEmpty()) return;

    const teams = teamService.getAll();
    if (teams.length === 0) return;

    const examplePlayers: Player[] = [
      {
        id: 'player_1',
        name: 'João Silva',
        photo: 'JS',
        teamId: teams[0].id,
        teamName: teams[0].name,
        position: 'Atacante',
        phone: '(11) 98765-4321',
        nationality: 'Brasileiro',
        birthDate: '1995-03-15',
        documentPhoto: '',
        shirtNumber: 10,
        isActive: true,
      },
      {
        id: 'player_2',
        name: 'Carlos Mendes',
        photo: 'CM',
        teamId: teams[0].id,
        teamName: teams[0].name,
        position: 'Goleiro',
        phone: '(11) 91234-5678',
        nationality: 'Brasileiro',
        birthDate: '1992-07-22',
        documentPhoto: '',
        shirtNumber: 1,
        isActive: true,
      },
      {
        id: 'player_3',
        name: 'Pedro Santos',
        photo: 'PS',
        teamId: teams[1]?.id || teams[0].id,
        teamName: teams[1]?.name || teams[0].name,
        position: 'Zagueiro',
        phone: '(11) 99876-5432',
        nationality: 'Brasileiro',
        birthDate: '1998-11-08',
        documentPhoto: '',
        shirtNumber: 4,
        isActive: true,
      },
    ];

    examplePlayers.forEach((player) => this.add(player));
  }
}

// Exporta instância única (Singleton)
export const playerService = new PlayerService();