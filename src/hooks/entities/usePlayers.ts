// src/hooks/entities/usePlayers.ts
import { useMemo } from 'react';
import { useCRUD } from '@/hooks/common/useCRUD';
import { playerService } from '@/services/playerService';
import type { Player } from '@/types/player.types';

export function usePlayers() {
  const {
    items: players,
    filteredItems,
    searchTerm,
    filterValue: teamFilter,
    activeDropdown,
    isLoading,
    setSearchTerm,
    setFilterValue: setTeamFilter,
    setActiveDropdown,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    loadItems,
  } = useCRUD<Player>({
    storageKey: 'champion_system_players',
    seedData: () => playerService.seedData(),
    filterFn: (player, search, team) => {
      // Filtro de busca
      const matchSearch =
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.position.toLowerCase().includes(search.toLowerCase()) ||
        player.teamName.toLowerCase().includes(search.toLowerCase()) ||
        player.nationality.toLowerCase().includes(search.toLowerCase()) ||
        player.shirtNumber.toString().includes(search);

      // Filtro por time
      const matchTeam =
        team === 'Todos os Times' ||
        player.teamName === team;

      return matchSearch && matchTeam;
    },
  });

  // Lista de times para o dropdown
  const teamOptions = useMemo(() => {
    return playerService.getTeamNames();
  }, [players]);

  // Adicionar jogador
  const addPlayer = (data: Omit<Player, 'id'>) => {
    const newPlayer = playerService.addPlayer(data);
    addItem(newPlayer);
    return newPlayer;
  };

  return {
    players,
    filteredPlayers: filteredItems,
    searchTerm,
    teamFilter,
    teamOptions,
    activeDropdown,
    isLoading,
    setSearchTerm,
    setTeamFilter,
    setActiveDropdown,
    addPlayer,
    updatePlayer: updateItem,
    deletePlayer: deleteItem,
    clearAll,
    loadPlayers: loadItems,
  };
}