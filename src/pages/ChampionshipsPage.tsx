// src/pages/ChampionshipsPage.tsx
import React, { useState } from 'react';
import { ChampionshipCard } from '../components/cards/ChampionshipCard';
import { EditChampionshipModal } from '../components/modals/EditChampionshipModal';
import { useChampionships } from '../hooks/useChampionships';
import type { Championship } from '../types/championship.types';

export function ChampionshipsPage() {
  const {
    filteredChampionships,
    activeDropdown,
    setActiveDropdown,
    updateChampionship,
    toggleStatus,
    deleteChampionship,
  } = useChampionships();

  // ✅ Estado para controlar qual campeonato está sendo editado
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null);

  // ✅ Função para abrir o modal de edição
  const handleEdit = (id: string) => {
    console.log('🔧 Editando campeonato ID:', id); // Debug
    
    const championship = filteredChampionships.find(c => c.id === id);
    console.log('📋 Campeonato encontrado:', championship); // Debug
    
    if (championship) {
      setEditingChampionship(championship);
      console.log('✅ Modal deve abrir agora'); // Debug
    } else {
      console.error('❌ Campeonato não encontrado!');
    }
    
    setActiveDropdown(null); // Fecha o dropdown
  };

  // ✅ Função para fechar o modal
  const handleCloseModal = () => {
    console.log('🚪 Fechando modal'); // Debug
    setEditingChampionship(null);
  };

  // ✅ Função para visualizar detalhes
  const handleViewDetails = (id: string) => {
    console.log('👁️ Visualizando detalhes do ID:', id); // Debug
    
    const championship = filteredChampionships.find(c => c.id === id);
    if (championship) {
      alert(`
📋 DETALHES DO CAMPEONATO

Nome: ${championship.name}
Organizador: ${championship.organizer}
Local: ${championship.local}
Telefone: ${championship.phone || 'Não informado'}
Categoria: ${championship.category}
Status: ${championship.status}
Formato: ${championship.format}
Times: ${championship.teams}
Início: ${new Date(championship.startDate).toLocaleDateString('pt-BR')}
Término: ${new Date(championship.endDate).toLocaleDateString('pt-BR')}
      `);
    }
    setActiveDropdown(null);
  };

  console.log('🔄 Renderizando página. Modal aberto?', !!editingChampionship); // Debug

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campeonatos</h1>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChampionships.map((championship) => (
          <ChampionshipCard
            key={championship.id}
            id={championship.id}
            logo={championship.logo}
            name={championship.name}
            organizer={championship.organizer}
            category={championship.category}
            status={championship.status}
            teams={championship.teams}
            format={championship.format}
            startDate={championship.startDate}
            endDate={championship.endDate}
            activeDropdown={activeDropdown}
            onToggleDropdown={setActiveDropdown}
            onToggleStatus={toggleStatus}
            onDelete={deleteChampionship}
            onEdit={handleEdit} // ✅ Passa a função de editar
            onViewDetails={handleViewDetails} // ✅ Passa a função de ver detalhes
            categoryBadgeVariant="dot"
            categoryBadgeColor="blue"
            statusBadgeColor={
              championship.status === 'Em Andamento' ? 'green' :
              championship.status === 'Agendado' ? 'blue' :
              championship.status === 'Finalizado' ? 'gray' :
              championship.status === 'Bloqueado' ? 'red' : 'yellow'
            }
          />
        ))}
      </div>

      {/* ✅ Modal de Edição - Renderiza quando editingChampionship não é null */}
      {editingChampionship && (
        <EditChampionshipModal
          championship={editingChampionship}
          isOpen={true}
          onClose={handleCloseModal}
          onUpdate={updateChampionship}
        />
      )}

      {/* Debug: Mostra status do modal */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
        Modal: {editingChampionship ? '✅ ABERTO' : '❌ FECHADO'}
        <br />
        Campeonatos: {filteredChampionships.length}
      </div>
    </div>
  );
}