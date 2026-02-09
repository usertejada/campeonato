// src/hooks/common/useClickOutside.ts
import { useEffect, RefObject } from 'react';

/**
 * Hook para detectar cliques fora de um elemento
 * @param ref - Referência do elemento
 * @param handler - Função a ser executada ao clicar fora
 * @param enabled - Se o hook está ativo
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, enabled]);
}