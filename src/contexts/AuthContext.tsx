// src/contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const user: User = {
    id: '1',
    name: 'Administrador',
    email: 'admin@championsystem.com',
    role: 'admin',
    initials: 'AD',
  };

  const logout = () => {
    console.log('Logout clicked - redirect to /login');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
