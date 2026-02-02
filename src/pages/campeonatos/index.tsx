// src/pages/campeonatos/index.tsx
import { Layout } from '../../components/organisms/Layout';
import { AuthProvider } from '../../contexts/AuthContext';
import React from 'react';
import { UserPlus, Trophy } from 'lucide-react';
import { Button } from '../../components/molecules/Button';
import { PageHeader } from '../../components/molecules/PageHeader';
import { EmptyState } from '../../components/molecules/EmptyState';
import { StatCard } from '@/components/molecules/StatCard';
import { FilterBar } from '../../components/organisms/FilterBar';
import { Modal } from '../../components/molecules/Modal';
import { CreateChampionshipModal } from '../../components/modals/CreateChampionshipModal';
import { ChampionshipCard } from '../../components/cards/ChampionshipCard';
import { EditChampionshipModal } from '../../components/modals/EditChampionshipModal';
import { ChampionshipDetailsModal } from '../../components/modals/ChampionshipDetailsModal';
import { useChampionships } from '@/hooks/entities/useChampionships';
import { useEntityModals } from '@/hooks/common/useEntityModals';
import type { Championship } from '../../types/championship.types';
import { getChampionshipStatCards } from '../../utils/helpers/statCards.helper';
import { getCategoryBadgeColor, getStatusBadgeColor } from '../../utils/helpers/badge.helper';

function CampeonatosContent() {
  const {
    filteredChampionships,
    searchTerm,
    categoryFilter,
    activeDropdown,
    stats,
    addChampionship,
    updateChampionship,
    setSearchTerm,
    setCategoryFilter,
    setActiveDropdown,
    toggleStatus,
    deleteChampionship,
  } = useChampionships();

  // ✅ Hook genérico para modais
  const {
    isCreateModalOpen,
    editingItem: editingChampionship,
    viewingItem: viewingChampionship,
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    closeDetailsModal,
    handleEdit,
    handleViewDetails,
  } = useEntityModals<Championship>({ 
    items: filteredChampionships, 
    setActiveDropdown,
    entityName: 'Campeonato'
  });

  const statCardsData = getChampionshipStatCards(stats);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Campeonatos"
        subtitle="Gerencie todos os campeonatos do sistema"
        action={
          <Button
            onClick={openCreateModal}
            leftIcon={UserPlus}
            variant="primary"
            size="md"
          >
            Novo Cameponato
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
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
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
          actionIcon={UserPlus}
          onAction={openCreateModal}
        />
      )}

      {/* Modal de Novo Campeonato */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Novo Campeonato"
      >
        <CreateChampionshipModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={(data) => {
            addChampionship(data);
          }}
        />
      </Modal>

      {/* Modal de Edição */}
      {editingChampionship && (
        <EditChampionshipModal
          championship={editingChampionship}
          isOpen={true}
          onClose={closeEditModal}
          onUpdate={updateChampionship}
        />
      )}

      {/* Modal de Detalhes */}
      {viewingChampionship && (
        <ChampionshipDetailsModal
          championship={viewingChampionship}
          isOpen={true}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
}

export default function CampeonatosPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <CampeonatosContent />
      </Layout>
    </AuthProvider>
  );
}