// src/hooks/entities/useChampionships.ts
import { useMemo } from 'react';
import { useCRUD } from '../common/useCRUD';
import { championshipService } from '../../services/championshipService';
import type { Championship } from '../../types/championship.types';

export function useChampionships() {
  // Usa o hook genérico CRUD
  const {
    items: championships,
    filteredItems,
    searchTerm,
    filterValue: categoryFilter,
    activeDropdown,
    isLoading,
    setSearchTerm,
    setFilterValue: setCategoryFilter,
    setActiveDropdown,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    loadItems,
  } = useCRUD<Championship>({
    storageKey: 'champion_system_championships',
    seedData: () => championshipService.seedData(),
    filterFn: (champ, search, category) => {
      // Filtro de busca
      const matchSearch =
        champ.name.toLowerCase().includes(search.toLowerCase()) ||
        champ.organizer.toLowerCase().includes(search.toLowerCase()) ||
        champ.status.toLowerCase().includes(search.toLowerCase()) ||
        champ.format.toLowerCase().includes(search.toLowerCase());

      // Filtro de categoria
      const matchCategory = category === 'Todas' || champ.category === category;

      return matchSearch && matchCategory;
    },
  });

  // Estatísticas calculadas
  const stats = useMemo(
    () => ({
      total: championships.length,
      active: championships.filter((c) => c.status === 'Em Andamento').length,
      scheduled: championships.filter((c) => c.status === 'Agendado').length,
      finished: championships.filter((c) => c.status === 'Finalizado').length,
      inactive: championships.filter((c) => c.status === 'Inativo').length,
      blocked: championships.filter((c) => c.status === 'Bloqueado').length,
    }),
    [championships]
  );

  // Método específico: adicionar campeonato
  const addChampionship = (data: Omit<Championship, 'id'>) => {
    const newChampionship = championshipService.addChampionship(data);
    addItem(newChampionship);
    return newChampionship;
  };

  // Método específico: alternar status
  const toggleStatus = (id: string) => {
    const updated = championshipService.toggleStatus(id);
    if (updated) {
      updateItem(id, updated);
    }
    setActiveDropdown(null);
  };

  return {
    championships,
    filteredChampionships: filteredItems,
    searchTerm,
    categoryFilter,
    activeDropdown,
    stats,
    isLoading,
    setSearchTerm,
    setCategoryFilter,
    setActiveDropdown,
    addChampionship,
    updateChampionship: updateItem,
    toggleStatus,
    deleteChampionship: deleteItem,
    clearAll,
    loadChampionships: loadItems,
  };
}