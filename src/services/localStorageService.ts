// src/services/localStorageService.ts

/**
 * Serviço genérico para gerenciar dados no LocalStorage
 * Funciona com qualquer tipo de dado e é type-safe
 */

export class LocalStorageService<T extends { id: string }> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * Busca todos os itens
   */
  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Erro ao buscar ${this.key}:`, error);
      return [];
    }
  }

  /**
   * Busca um item por ID
   */
  getById(id: string): T | null {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Adiciona um novo item
   */
  add(item: T): T {
    try {
      const items = this.getAll();
      items.push(item);
      localStorage.setItem(this.key, JSON.stringify(items));
      return item;
    } catch (error) {
      console.error(`Erro ao adicionar ${this.key}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza um item existente
   */
  update(id: string, updatedItem: Partial<T>): T | null {
    try {
      const items = this.getAll();
      const index = items.findIndex(item => item.id === id);
      
      if (index === -1) return null;
      
      items[index] = { ...items[index], ...updatedItem };
      localStorage.setItem(this.key, JSON.stringify(items));
      return items[index];
    } catch (error) {
      console.error(`Erro ao atualizar ${this.key}:`, error);
      throw error;
    }
  }

  /**
   * Remove um item por ID
   */
  delete(id: string): boolean {
    try {
      const items = this.getAll();
      const filteredItems = items.filter(item => item.id !== id);
      
      if (items.length === filteredItems.length) return false;
      
      localStorage.setItem(this.key, JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error(`Erro ao deletar ${this.key}:`, error);
      throw error;
    }
  }

  /**
   * Limpa todos os itens
   */
  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Erro ao limpar ${this.key}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se existe algum item
   */
  isEmpty(): boolean {
    return this.getAll().length === 0;
  }

  /**
   * Conta quantos itens existem
   */
  count(): number {
    return this.getAll().length;
  }
}

// Exemplo de uso:
// const championshipService = new LocalStorageService<Championship>('championships');
// championshipService.add(newChampionship);
// championshipService.getAll();