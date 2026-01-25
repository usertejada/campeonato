// src/hooks/common/useCRUD.ts
import { useState, useMemo, useEffect } from 'react';

interface UseCRUDOptions<T extends { id: string }> {
  storageKey: string;
  seedData?: () => void;
  filterFn?: (item: T, searchTerm: string, filterValue: string) => boolean;
}

/**
 * Hook genérico para Create, Read, Update, Delete no localStorage
 */
export function useCRUD<T extends { id: string }>(options: UseCRUDOptions<T>) {
  const { storageKey, seedData, filterFn } = options;
  
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('Todas');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Carrega dados do localStorage
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    if (typeof window === 'undefined') return;
    
    setIsLoading(true);
    try {
      // Se tiver seedData e localStorage vazio, popula
      const stored = localStorage.getItem(storageKey);
      if (!stored && seedData) {
        seedData();
      }
      
      // Carrega items
      const data = localStorage.getItem(storageKey);
      setItems(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar items
  const filteredItems = useMemo(() => {
    if (!filterFn) return items;
    return items.filter(item => filterFn(item, searchTerm, filterValue));
  }, [items, searchTerm, filterValue, filterFn]);

  // Adicionar
  const addItem = (newItem: T) => {
    try {
      const updated = [newItem, ...items];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      throw error;
    }
  };

  // Atualizar
  const updateItem = (id: string, data: Partial<T>) => {
    try {
      const updated = items.map(item =>
        item.id === id ? { ...item, ...data } : item
      );
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setItems(updated);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      throw error;
    }
  };

  // Deletar
  const deleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      try {
        const updated = items.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setItems(updated);
        setActiveDropdown(null);
      } catch (error) {
        console.error('Erro ao deletar:', error);
      }
    }
  };

  // Limpar tudo
  const clearAll = () => {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
      try {
        localStorage.removeItem(storageKey);
        setItems([]);
      } catch (error) {
        console.error('Erro ao limpar:', error);
      }
    }
  };

  return {
    items,
    filteredItems,
    searchTerm,
    filterValue,
    activeDropdown,
    isLoading,
    setSearchTerm,
    setFilterValue,
    setActiveDropdown,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    loadItems,
  };
}