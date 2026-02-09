// src/hooks/common/useEntityModals.ts
import { useState } from 'react';

interface UseEntityModalsProps<T> {
  items: T[];
  setActiveDropdown: (id: string | null) => void;
  idKey?: keyof T; // Qual campo é o ID (padrão: 'id')
  entityName?: string; // Nome da entidade para logs (opcional)
}

export function useEntityModals<T extends Record<string, any>>({ 
  items, 
  setActiveDropdown,
  idKey = 'id' as keyof T,
  entityName = 'Item'
}: UseEntityModalsProps<T>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);

  // Função auxiliar para buscar item pelo ID
  const findItemById = (id: string): T | undefined => {
    return items.find(item => String(item[idKey]) === id);
  };

  // ========== MODAIS DE CRIAÇÃO ==========
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // ========== MODAIS DE EDIÇÃO ==========
  const openEditModal = (item: T) => {
    console.log(`🔧 Editando ${entityName}:`, item[idKey]);
    setEditingItem(item);
  };

  const closeEditModal = () => {
    console.log(`🚪 Fechando modal de edição de ${entityName}`);
    setEditingItem(null);
  };

  // Handler completo: busca o item e abre modal
  const handleEdit = (id: string) => {
    const item = findItemById(id);
    if (item) {
      openEditModal(item);
    }
    setActiveDropdown(null);
  };

  // ========== MODAIS DE DETALHES ==========
  const openDetailsModal = (item: T) => {
    console.log(`👁️ Visualizando detalhes de ${entityName}:`, item[idKey]);
    setViewingItem(item);
  };

  const closeDetailsModal = () => {
    setViewingItem(null);
  };

  // Handler completo: busca o item e abre modal
  const handleViewDetails = (id: string) => {
    const item = findItemById(id);
    if (item) {
      openDetailsModal(item);
    }
    setActiveDropdown(null);
  };

  return {
    // Estados
    isCreateModalOpen,
    editingItem,
    viewingItem,
    
    // Funções de controle direto
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDetailsModal,
    closeDetailsModal,
    
    // Handlers prontos (com busca automática)
    handleEdit,
    handleViewDetails,
  };
}