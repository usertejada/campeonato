// src/pages/historico/index.tsx

import React from 'react';
import { History, Calendar } from 'lucide-react';
import { Layout } from '@/components/organisms/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/molecules/PageHeader';
import { FilterBar } from '@/components/organisms/FilterBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { HistoricoCard } from '@/components/cards/HistoricoCard';
import { RodadaHeader } from '@/components/jogos/RodadaHeader';
import { useJogos } from '@/hooks/entities/useJogos';
import { formatRodadaDate, getRodadaLabel } from '@/utils/common/date.utils';

function HistoricoContent() {
  const {
    filteredJogos,
    searchTerm,
    setSearchTerm,
  } = useJogos();

  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  // Filtra apenas jogos FINALIZADOS para esta página
  const jogosFinalizados = React.useMemo(() => {
    return filteredJogos.filter(jogo => jogo.status === 'finalizado');
  }, [filteredJogos]);

  // Agrupa jogos por data para exibir em rodadas (ordem decrescente - mais recente primeiro)
  const jogosPorRodada = React.useMemo(() => {
    const grupos: Record<string, typeof jogosFinalizados> = {};
    
    jogosFinalizados.forEach((jogo) => {
      if (!grupos[jogo.data]) {
        grupos[jogo.data] = [];
      }
      grupos[jogo.data].push(jogo);
    });

    // Converte para array e ordena por data (decrescente)
    return Object.entries(grupos)
      .sort(([dataA], [dataB]) => dataB.localeCompare(dataA))
      .map(([data, jogos]) => ({
        data,
        jogos: jogos.sort((a, b) => b.horario.localeCompare(a.horario)),
      }));
  }, [jogosFinalizados]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Histórico de Jogos"
        subtitle="Visualize todos os jogos finalizados"
      />

      {/* Filtros e Busca */}
      <FilterBar
        className="text-gray-500"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar jogos, times, estádios..."
      />

      {/* Lista de Jogos ou Empty State */}
      {jogosFinalizados.length > 0 ? (
        <div className="space-y-8">
          {jogosPorRodada.map((rodada, index) => {
            const primeiroJogo = rodada.jogos[0];
            
            return (
              <div key={rodada.data}>
                {/* Header da Rodada */}
                <RodadaHeader
                  titulo={getRodadaLabel(jogosPorRodada.length - index)}
                  data={formatRodadaDate(rodada.data)}
                  local={primeiroJogo.estadio}
                  horario={`Partidas realizadas`}
                  className="mb-4"
                />

                {/* Grid de Jogos da Rodada */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rodada.jogos.map((jogo) => (
                    <HistoricoCard
                      key={jogo.id}
                      jogo={jogo}
                      activeDropdown={activeDropdown}
                      onToggleDropdown={setActiveDropdown}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title={searchTerm ? 'Nenhum jogo encontrado' : 'Nenhum jogo finalizado'}
          description={
            searchTerm
              ? 'Tente buscar por outro time ou estádio'
              : 'Os jogos finalizados aparecerão aqui automaticamente'
          }
          actionLabel="Ver Jogos Ativos"
          actionIcon={Calendar}
          onAction={() => window.location.href = '/jogos'}
        />
      )}
    </div>
  );
}

export default function HistoricoPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <HistoricoContent />
      </Layout>
    </AuthProvider>
  );
}