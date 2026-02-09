// src/services/championshipService.ts
import { LocalStorageService } from './localStorageService';
import { generateUniqueIdWithCheck } from '../utils/common/id.utils';
import type { Championship } from '../types/championship.types';

/**
 * Serviço específico para gerenciar Campeonatos
 */
class ChampionshipService extends LocalStorageService<Championship> {
  constructor() {
    super('champion_system_championships');
  }

  /**
   * Busca campeonatos por categoria
   */
  getByCategory(category: string): Championship[] {
    if (category === 'Todas') return this.getAll();
    return this.getAll().filter(champ => champ.category === category);
  }

  /**
   * Busca campeonatos por status
   */
  getByStatus(status: string): Championship[] {
    return this.getAll().filter(champ => champ.status === status);
  }

  /**
   * Busca campeonatos ativos
   */
  getActive(): Championship[] {
    return this.getAll().filter(champ => 
      champ.status === 'Agendado' || champ.status === 'Em Andamento'
    );
  }

  /**
   * Alterna o status entre Ativo/Inativoo
   */
  toggleStatus(id: string): Championship | null {
    const championship = this.getById(id);
    if (!championship) return null;

    const newStatus = championship.status === 'Inativo' ? 'Agendado' : 'Inativo';
    return this.update(id, { status: newStatus });
  }

  /**
   * Busca campeonatos por termo de pesquisa
   */
  search(term: string): Championship[] {
    if (!term) return this.getAll();
    
    const lowerTerm = term.toLowerCase();
    return this.getAll().filter(champ => 
      champ.name.toLowerCase().includes(lowerTerm) ||
      champ.organizer.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Adiciona um novo campeonato com ID único garantido
   */
  addChampionship(data: Omit<Championship, 'id'>): Championship {
    const newChampionship: Championship = {
      ...data,
      id: generateUniqueIdWithCheck(this.getAll(), 'champ')
    };
    
    return this.add(newChampionship);
  }

  /**
   * Popula dados de exemplo
   */
  seedData(): void {
    if (!this.isEmpty()) return;

    const exampleChampionships: Championship[] = [
      {
        id: '1',
        name: 'Copa Verão 2025',
        logo: '🏆',
        organizer: 'Prefeitura Municipal',
        local: 'Estádio Municipal',
        category: 'Masculino Livre',
        status: 'Em Andamento',
        format: 'Pontos Corridos',
        teams: 16,
        startDate: '2026-02-14',
        endDate: '2026-04-30'
      }
      
    ];

    exampleChampionships.forEach(champ => this.add(champ));
  }
}

// Exporta instância única (Singleton)
export const championshipService = new ChampionshipService();