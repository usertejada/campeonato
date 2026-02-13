// src/config/navigation.ts
import {
  Home,
  Trophy,
  Users,
  UserCircle,
  Calendar,
  History,
  BarChart3,
  Target,
  CreditCard,
  FileText,
  Award,
  Settings,
  Bell,
  TrendingUp,
} from 'lucide-react';
import type { NavigationItem, NavigationSection } from '../types';

export const mainNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', path: '/', icon: Home, description: 'Visão geral' },
  { name: 'Campeonatos', path: '/campeonatos', icon: Trophy },
  { name: 'Times', path: '/times', icon: Users },
  { name: 'Jogadores', path: '/jogadores', icon: UserCircle },
  { name: 'Jogos', path: '/jogos', icon: Calendar },
];

export const managementItems: NavigationItem[] = [
  { name: 'Histórico de Jogos', path: '/historico', icon: History },
  { name: 'Classificação', path: '/classificacao', icon: BarChart3 },
  { name: 'Artilharia', path: '/artilharia', icon: Target },
];

export const systemItems: NavigationItem[] = [
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
  { name: 'Notificações', path: '/notificacoes', icon: Bell },
];

export const navigationSections: NavigationSection[] = [
  { title: 'NAVEGAÇÃO', items: mainNavigationItems },
  { title: 'GERENCIAMENTO', items: managementItems },
  { title: 'SISTEMA', items: systemItems },
];
