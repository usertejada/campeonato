// src/pages/classificacao/index.tsx

import React from 'react';
import { Trophy, Users, Calendar, Target } from 'lucide-react';
import { Layout } from '@/components/organisms/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/molecules/PageHeader';
import { TabelaClassificacao } from '@/components/classificacao/TabelaClassificacao';
import { useClassificacao } from '@/hooks/entities/useClassificacao';
import { Icon } from '@/components/atoms/Icon';
import { StatCard } from '@/components/molecules/StatCard';
import { FilterBar } from '@/components/organisms/FilterBar';

function ClassificacaoContent() {
  const [isMounted, setIsMounted] = React.useState(false);
  const {
    classificacao,
    championshipFilter,
    championshipOptions,
    setChampionshipFilter,
    isLoading,
  } = useClassificacao();

  // Garante que o componente está montado antes de renderizar conteúdo dinâmico
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calcula estatísticas gerais
  const totalTimes = classificacao.length;
  const totalJogos = classificacao.reduce((sum, stat) => sum + stat.jogos, 0) / 2; // Divide por 2 pois cada jogo conta para 2 times
  const totalGols = classificacao.reduce((sum, stat) => sum + stat.golsPro, 0);
  const lider = classificacao[0];

  // Cards de estatísticas
  const statCardsData = [
    {
      label: 'Times Participantes',
      value: totalTimes,
      icon: Users,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
    },
    {
      label: 'Jogos Realizados',
      value: Math.round(totalJogos),
      icon: Calendar,
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
    },
    {
      label: 'Gols Marcados',
      value: totalGols,
      icon: Target,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
    },
    {
      label: lider ? `Líder com ${lider.pontos} pts` : 'Sem líder',
      value: lider ? lider.time.name : '-',
      icon: Trophy,
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Classificação"
        subtitle="Acompanhe o desempenho dos times no campeonato"
        titleClassName="text-blue-600"
      />

      {/* Filtro de Campeonato */}
      {isMounted && (
        <FilterBar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Buscar times..."
          filters={[
            {
              value: championshipFilter,
              onChange: setChampionshipFilter,
              options: championshipOptions,
              label: 'Campeonato'
            }
          ]}
        />
      )}

      {/* Cards de Estatísticas */}
      {!isLoading && classificacao.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCardsData.map((card, index) => (
            <StatCard
              key={index}
              title={card.label}
              value={card.value}
              icon={card.icon}
              gradientFrom={card.gradientFrom}
              gradientTo={card.gradientTo}
              variant="compact"
            />
          ))}
        </div>
      )}

      {/* Legenda */}
      {!isLoading && classificacao.length > 0 && (
        <div className="bg-linear-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon icon={Trophy} size={16} className="text-blue-600" />
            Legenda
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <span className="font-bold text-gray-700">P</span>
              <span className="text-gray-600"> - Pontos</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">J</span>
              <span className="text-gray-600"> - Jogos</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">V</span>
              <span className="text-gray-600"> - Vitórias</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">E</span>
              <span className="text-gray-600"> - Empates</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">D</span>
              <span className="text-gray-600"> - Derrotas</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">GP</span>
              <span className="text-gray-600"> - Gols Pró</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">GC</span>
              <span className="text-gray-600"> - Gols Contra</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">SG</span>
              <span className="text-gray-600"> - Saldo de Gols</span>
            </div>
            <div>
              <span className="font-bold text-gray-700">%</span>
              <span className="text-gray-600"> - Aproveitamento</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Carregando classificação...</p>
          </div>
        </div>
      )}

      {/* Tabela de Classificação */}
      {!isLoading && <TabelaClassificacao classificacao={classificacao} />}

      {/* Mensagem quando não há jogos finalizados */}
      {!isLoading && classificacao.length > 0 && totalJogos === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Icon icon={Trophy} size={48} className="text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Campeonato em Preparação
          </h3>
          <p className="text-gray-600">
            Os times estão cadastrados! Finalize partidas para ver a classificação atualizada.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ClassificacaoPage() {
  return (
    <AuthProvider>
      <Layout showBreadcrumb={true} maxWidth="7xl">
        <ClassificacaoContent />
      </Layout>
    </AuthProvider>
  );
}