// src/pages/players/index.tsx

import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Layout } from '@/components/organisms/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { Button } from '@/components/molecules/Button';
import { PageHeader } from '@/components/molecules/PageHeader';
import { FilterBar } from '@/components/organisms/FilterBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PlayerCard } from '@/components/cards/PlayerCard';
import { CreatePlayerModal } from '@/components/modals/players/CreatePlayerModal';
import { PlayerDetailsModal } from '@/components/modals/players/PlayerDetailsModal';
import { ModalCarteirinha } from '@/components/carteirinhas/ModalCarteirinha';
import { usePlayers } from '@/hooks/entities/usePlayers';
import { useEntityModals } from '@/hooks/common/useEntityModals';
import type { Player } from '@/types/player.types';

function PlayersContent() {
  const {
    filteredPlayers,
    searchTerm,
    teamFilter,
    teamOptions,
    activeDropdown,
    setSearchTerm,
    setTeamFilter,
    setActiveDropdown,
    addPlayer,
    updatePlayer,
    deletePlayer,
  } = usePlayers();

  const {
    isCreateModalOpen,
    editingItem: editingPlayer,
    viewingItem: viewingPlayer,
    carteirinhaItem: carteirinhaPlayer,
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    closeDetailsModal,
    closeCarteirinhaModal,
    handleEdit,
    handleViewDetails,
    handleGerarCarteirinha,
  } = useEntityModals<Player>({ 
    items: filteredPlayers, 
    setActiveDropdown,
    entityName: 'Jogador'
  });

  const handleToggleStatus = (id: string) => {
    const player = filteredPlayers.find(p => p.id === id);
    if (player) {
      updatePlayer(id, { isActive: !player.isActive });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Jogadores"
        subtitle="Gerencie todos os jogadores cadastrados"
        titleClassName="text-blue-600"
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon={UserPlus}
            onClick={openCreateModal}
          >
            Novo Jogador
          </Button>
        }
      />

      {/* Filtros e Busca */}
      <FilterBar 
        className="text-gray-500"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar jogadores..."
        filters={[
          {
            value: teamFilter,
            onChange: setTeamFilter,
            options: teamOptions,
            label: 'Time',
          },
        ]}
      />

      {/* Grid de Cards ou Empty State */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              name={player.name}
              photo={player.photo}
              teamName={player.teamName}
              position={player.position}
              phone={player.phone}
              nationality={player.nationality}
              birthDate={player.birthDate}
              shirtNumber={player.shirtNumber}
              isActive={player.isActive}
              activeDropdown={activeDropdown}
              onToggleDropdown={setActiveDropdown}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onGerarCarteirinha={handleGerarCarteirinha}
              onDelete={deletePlayer}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Nenhum jogador encontrado"
          description="Tente ajustar os filtros ou adicione um novo jogador"
          actionLabel="Novo Jogador"
          actionIcon={UserPlus}
          onAction={openCreateModal}
        />
      )}

      {/* Modal de Detalhes */}
      {viewingPlayer && (
        <PlayerDetailsModal
          player={viewingPlayer}
          isOpen={true}
          onClose={closeDetailsModal}
        />
      )}

      {/* Modal de Novo Jogador */}
      <CreatePlayerModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={(data) => {
          addPlayer(data);
        }}
        teamOptions={teamOptions}
      />

      {/* Modal de Edição */}
      {editingPlayer && (
        <CreatePlayerModal
          isOpen={true}
          onClose={closeEditModal}
          onSubmit={(data) => {
            updatePlayer(editingPlayer.id, data);
            closeEditModal();
          }}
          initialData={editingPlayer}
          teamOptions={teamOptions}
        />
      )}

      {/* Modal de Carteirinha */}
      {carteirinhaPlayer && (
        <ModalCarteirinha
          isOpen={true}
          onClose={closeCarteirinhaModal}
          jogador={carteirinhaPlayer}
        />
      )}
    </div>
  );
}

export default function PlayersPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <PlayersContent />
      </Layout>
    </AuthProvider>
  );
}