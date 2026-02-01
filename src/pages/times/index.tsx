// src/pages/times/index.tsx

import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Layout } from '../../components/organisms/Layout';
import { AuthProvider } from '../../contexts/AuthContext';
import { Button } from '../../components/molecules/Button';
import { PageHeader } from '../../components/molecules/PageHeader';
import { FilterBar } from '../../components/organisms/FilterBar';
import { EmptyState } from '../../components/molecules/EmptyState';
import { TeamCard } from '../../components/cards/TeamCard';
import { useTeams } from '../../hooks/entities/useTeams';

function TimesContent() {
  const {
    filteredTeams,
    searchTerm,
    championshipFilter,
    championshipOptions,
    activeDropdown,
    setSearchTerm,
    setChampionshipFilter,
    setActiveDropdown,
    updateTeam,
    deleteTeam,
  } = useTeams();

  const handleNovoTime = () => {
    // TODO: abrir modal de criação
    console.log('Novo Time clicado');
  };

  const handleEdit = (id: string) => {
    // TODO: abrir modal de edição
    console.log('Editar time:', id);
  };

  const handleViewDetails = (id: string) => {
    // TODO: abrir modal de detalhes
    console.log('Ver detalhes do time:', id);
  };

  const handleToggleStatus = (id: string) => {
    const team = filteredTeams.find(t => t.id === id);
    if (team) {
      updateTeam(id, { isActive: !team.isActive });
    }
  };

  const handleDelete = (id: string) => {
    deleteTeam(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Times"
        subtitle="Gerencie as equipes dos campeonatos"
        titleClassName="text-blue-600"
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon={UserPlus}
            onClick={handleNovoTime}
          >
            Novo Time
          </Button>
        }
      />

      {/* Filtros e Busca */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar times..."
        filters={[
          {
            value: championshipFilter,
            onChange: setChampionshipFilter,
            options: championshipOptions,
            label: 'Campeonato',
          },
        ]}
      />

      {/* Grid de Cards */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              id={team.id}
              name={team.name}
              logo={team.logo}
              coach={team.coach}
              championshipName={team.championshipName}
              email={team.email}
              phone={team.phone}
              foundedYear={team.foundedYear}
              isActive={team.isActive}
              activeDropdown={activeDropdown}
              onToggleDropdown={setActiveDropdown}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Nenhum time encontrado"
          description="Tente ajustar os filtros ou adicione um novo time"
          actionLabel="Novo Time"
          actionIcon={UserPlus}
          onAction={handleNovoTime}
        />
      )}
    </div>
  );
}

export default function TimesPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <TimesContent />
      </Layout>
    </AuthProvider>
  );
}