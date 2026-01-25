// src/pages/index.tsx
import { Layout } from '../components/organisms/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { ModalProvider } from '../contexts/ModalContext';
import { Trophy, TrendingUp, Users, Calendar } from 'lucide-react';
import { PageHeader } from '../components/molecules/PageHeader';
import { StatCard } from '@/components/molecules/StatCard';

function DashboardContent() {
  const stats = [
    {
      title: 'Campeonatos',
      value: '24',
      icon: Trophy,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-50',
      trend: { value: '12%', isPositive: true }
    },
    {
      title: 'Times',
      value: '156',
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50',
      trend: { value: '8%', isPositive: true }
    },
    {
      title: 'Partidas',
      value: '432',
      icon: Calendar,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
      trend: { value: '3%', isPositive: false }
    },
    {
      title: 'Jogadores',
      value: '2.4k',
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50',
      trend: { value: '24%', isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Bem-vindo ao ChampionSystem"
      />

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
            iconBgColor={stat.iconBgColor}
            trend={stat.trend}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Layout showBreadcrumb={true} maxWidth="7xl">
          <DashboardContent />
        </Layout>
      </ModalProvider>
    </AuthProvider>
  );
}