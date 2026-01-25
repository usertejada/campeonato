// src/contexts/ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  openedModals: Set<string>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
  toggleModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType>({
  openedModals: new Set(),
  openModal: () => {},
  closeModal: () => {},
  isModalOpen: () => false,
  toggleModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openedModals, setOpenedModals] = useState<Set<string>>(new Set());

  const openModal = (id: string) => {
    setOpenedModals(prev => new Set(prev).add(id));
  };

  const closeModal = (id: string) => {
    setOpenedModals(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const isModalOpen = (id: string) => openedModals.has(id);

  const toggleModal = (id: string) => {
    if (isModalOpen(id)) {
      closeModal(id);
    } else {
      openModal(id);
    }
  };

  return (
    <ModalContext.Provider value={{ openedModals, openModal, closeModal, isModalOpen, toggleModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}