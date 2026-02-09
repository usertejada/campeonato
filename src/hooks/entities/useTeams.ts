// src/hooks/entities/useTeams.ts
import { useMemo } from 'react';
import { useCRUD } from '../common/useCRUD';
import { teamService } from '../../services/teamService';
import type { Team } from '../../types/team.types';

export function useTeams() {
  const {
    items: teams,
    filteredItems,
    searchTerm,
    filterValue: championshipFilter,
    activeDropdown,
    isLoading,
    setSearchTerm,
    setFilterValue: setChampionshipFilter,
    setActiveDropdown,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    loadItems,
  } = useCRUD<Team>({
    storageKey: 'champion_system_teams',
    seedData: () => teamService.seedData(),
    filterFn: (team, search, championship) => {
      // Filtro de busca
      const matchSearch =
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        (team.coach?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (team.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        team.championshipName.toLowerCase().includes(search.toLowerCase());

      // Filtro por campeonato
      const matchChampionship =
        championship === 'Todos os Campeonatos' ||
        team.championshipName === championship;

      return matchSearch && matchChampionship;
    },
  });

  // Lista de campeonatos para o dropdown
  const championshipOptions = useMemo(() => {
    return teamService.getChampionshipNames();
  }, [teams]);

  // Adicionar time
  const addTeam = (data: Omit<Team, 'id'>) => {
    const newTeam = teamService.addTeam(data);
    addItem(newTeam);
    return newTeam;
  };

  return {
    teams,
    filteredTeams: filteredItems,
    searchTerm,
    championshipFilter,
    championshipOptions,
    activeDropdown,
    isLoading,
    setSearchTerm,
    setChampionshipFilter,
    setActiveDropdown,
    addTeam,
    updateTeam: updateItem,
    deleteTeam: deleteItem,
    clearAll,
    loadTeams: loadItems,
  };
}