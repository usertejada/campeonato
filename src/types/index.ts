// src/types/index.ts

import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  description?: string;
  roles?: string[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type MaxWidth = 'full' | '7xl' | '6xl' | '5xl';