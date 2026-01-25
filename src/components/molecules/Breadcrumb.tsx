// src/components/molecules/Breadcrumb.tsx
import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { Icon } from '../atoms/Icon';

interface BreadcrumbProps {
  pathname: string;
}

const routeNameMap: Record<string, string> = {
  '': 'Dashboard',
  'campeonatos': 'Campeonatos',
  'times': 'Times',
  'jogadores': 'Jogadores',
  'jogos': 'Jogos',
  'historico': 'Histórico de Jogos',
  'classificacao': 'Classificação',
  'artilharia': 'Artilharia',
  'carteirinhas': 'Carteirinhas',
  'relatorios': 'Relatórios',
  'trofeus': 'Troféus',
  'configuracoes': 'Configurações',
  'notificacoes': 'Notificações',
  'estatisticas': 'Estatísticas',
};

export function Breadcrumb({ pathname }: BreadcrumbProps) {
  const pathSegments = pathname.split('/').filter(segment => segment && isNaN(Number(segment)));
  
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link href="/" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
        <Icon icon={Home} size={16} />
      </Link>
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const displayName = routeNameMap[segment] || segment;
        const href = '/' + pathSegments.slice(0, index + 1).join('/');

        return (
          <React.Fragment key={segment}>
            <Icon icon={ChevronRight} size={16} className="text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{displayName}</span>
            ) : (
              <Link href={href} className="text-gray-500 hover:text-blue-600 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
