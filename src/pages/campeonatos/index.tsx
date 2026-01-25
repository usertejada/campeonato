// src/pages/campeonatos/index.tsx
import { Layout } from '../../components/organisms/Layout';
import { AuthProvider } from '../../contexts/AuthContext';
import { ModalProvider } from '../../contexts/ModalContext';
import React, { useState } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { Button } from '../../components/molecules/Button';
import { PageHeader } from '../../components/molecules/PageHeader';
import { EmptyState } from '../../components/molecules/EmptyState';
import { StatCard } from '@/components/molecules/StatCard';
import { FilterBar } from '../../components/organisms/FilterBar';
import { Modal } from '../../components/molecules/Modal';
import { ChampionshipForm } from '../../components/forms/ChampionshipForm';
import { ChampionshipCard } from '../../components/cards/ChampionshipCard';
import { EditChampionshipModal } from '../../components/modals/EditChampionshipModal';
import { ChampionshipDetailsModal } from '../../components/modals/ChampionshipDetailsModal'; // ✅ NOVO
import { useChampionships } from '@/hooks/entities/useChampionships';
import { getChampionshipStatCards } from '../../utils/helpers/statCards.helper';
import { getCategoryBadgeColor, getStatusBadgeColor } from '../../utils/helpers/badge.helper';
import type { Championship } from '../../types/championship.types';

function CampeonatosContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null);
  const [viewingChampionship, setViewingChampionship] = useState<Championship | null>(null); // ✅ NOVO
  
  const {
    filteredChampionships,
    searchTerm,
    categoryFilter,
    activeDropdown,
    stats,
    addChampionship,
    updateChampionship, // ✅ ADICIONAR
    setSearchTerm,
    setCategoryFilter,
    setActiveDropdown,
    toggleStatus,
    deleteChampionship,
  } = useChampionships();

  const statCardsData = getChampionshipStatCards(stats);

  // ✅ Função para abrir o modal de edição
  const handleEdit = (id: string) => {
    console.log('🔧 Editando campeonato ID:', id);
    const championship = filteredChampionships.find(c => c.id === id);
    console.log('📋 Campeonato encontrado:', championship);
    
    if (championship) {
      setEditingChampionship(championship);
      console.log('✅ Modal de edição deve abrir');
    }
    setActiveDropdown(null);
  };

  // ✅ Função para fechar o modal de edição
  const handleCloseEditModal = () => {
    console.log('🚪 Fechando modal de edição');
    setEditingChampionship(null);
  };

  // ✅ Função para visualizar detalhes
  const handleViewDetails = (id: string) => {
    console.log('👁️ Visualizando detalhes do ID:', id);
    const championship = filteredChampionships.find(c => c.id === id);
    
    if (championship) {
      setViewingChampionship(championship); // ✅ Abre o modal
      console.log('✅ Modal de detalhes deve abrir');
    }
    setActiveDropdown(null);
  };

  // ✅ Função para fechar o modal de detalhes
  const handleCloseDetailsModal = () => {
    setViewingChampionship(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Campeonatos"
        subtitle="Gerencie todos os campeonatos do sistema"
        action={
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={Plus}
            variant="primary"
            size="md"
          >
            Novo
          </Button>
        }
      />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsData.map((card, index) => (
          <StatCard
            key={index}
            title={card.label}
            value={card.value}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBgColor={card.iconBgColor}
            variant="compact"
          />
        ))}
      </div>

      {/* Filtros e Busca */}
      <FilterBar
        className='text-gray-500'
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar campeonatos..."
        filters={[
          {
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: ['Todas', 'Masculino Livre', 'Feminino Livre', 'Veterano 35+', 'Sub-13', 'Sub-15'],
            label: 'Categoria'
          }
        ]}
      />

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredChampionships.map((champ) => (
          <ChampionshipCard
            key={champ.id}
            id={champ.id}
            logo={champ.logo}
            name={champ.name}
            organizer={champ.organizer}
            category={champ.category}
            status={champ.status}
            teams={champ.teams}
            format={champ.format}
            startDate={champ.startDate}
            endDate={champ.endDate}
            categoryBadgeVariant="dot"
            categoryBadgeColor={getCategoryBadgeColor(champ.category)}
            statusBadgeColor={getStatusBadgeColor(champ.status)}
            activeDropdown={activeDropdown}
            onToggleDropdown={setActiveDropdown}
            onToggleStatus={toggleStatus}
            onDelete={deleteChampionship}
            onEdit={handleEdit} // ✅ ADICIONAR ESTA LINHA
            onViewDetails={handleViewDetails} // ✅ ADICIONAR ESTA LINHA
          />
        ))}
      </div>

      {/* Mensagem se não houver resultados */}
      {filteredChampionships.length === 0 && (
        <EmptyState
          icon={Trophy}
          title="Nenhum campeonato encontrado"
          description="Tente ajustar os filtros ou adicione um novo campeonato"
          actionLabel="Novo Campeonato"
          actionIcon={Plus}
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Modal de Novo Campeonato */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Campeonato"
      >
        <ChampionshipForm
          onSubmit={(data) => {
            addChampionship(data);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* ✅ Modal de Edição */}
      {editingChampionship && (
        <EditChampionshipModal
          championship={editingChampionship}
          isOpen={true}
          onClose={handleCloseEditModal}
          onUpdate={updateChampionship}
        />
      )}

      {/* ✅ Modal de Detalhes */}
      {viewingChampionship && (
        <ChampionshipDetailsModal
          championship={viewingChampionship}
          isOpen={true}
          onClose={handleCloseDetailsModal}
        />
      )}

      {/* Debug - pode remover depois */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs space-y-1">
        <div>Edição: {editingChampionship ? '✅ ABERTO' : '❌ FECHADO'}</div>
        <div>Detalhes: {viewingChampionship ? '✅ ABERTO' : '❌ FECHADO'}</div>
      </div>
    </div>
  );
}

export default function CampeonatosPage() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Layout showBreadcrumb={true} maxWidth="7xl">
          <CampeonatosContent />
        </Layout>
      </ModalProvider>
    </AuthProvider>
  );
}