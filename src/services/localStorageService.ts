// src/services/localStorageService.ts

export class LocalStorageService<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * Verifica se está rodando no browser (client-side)
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Retorna todos os itens salvos
   */
  getAll(): T[] {
    if (!this.isBrowser()) {
      return [];
    }

    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Erro ao buscar ${this.key}:`, error);
      return [];
    }
  }

  /**
   * Retorna um item específico por ID
   */
  getById(id: string): T | undefined {
    if (!this.isBrowser()) {
      return undefined;
    }

    try {
      const items = this.getAll();
      return items.find((item: any) => item.id === id);
    } catch (error) {
      console.error(`Erro ao buscar item ${id} de ${this.key}:`, error);
      return undefined;
    }
  }

  /**
   * Salva todos os itens
   */
  setAll(items: T[]): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (error) {
      console.error(`Erro ao salvar ${this.key}:`, error);
    }
  }

  /**
   * Adiciona um novo item e retorna o item adicionado
   */
  add(item: T): T {
    if (!this.isBrowser()) {
      return item;
    }

    try {
      const items = this.getAll();
      items.push(item);
      this.setAll(items);
      return item;
    } catch (error) {
      console.error(`Erro ao adicionar item em ${this.key}:`, error);
      return item;
    }
  }

  /**
   * Atualiza um item existente
   */
  update(id: string, updatedItem: Partial<T>): T | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      const items = this.getAll();
      const index = items.findIndex((item: any) => item.id === id);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem };
        this.setAll(items);
        return items[index];
      }
      return null;
    } catch (error) {
      console.error(`Erro ao atualizar item ${id} em ${this.key}:`, error);
      return null;
    }
  }

  /**
   * Remove um item por ID
   */
  remove(id: string): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      const items = this.getAll();
      const filteredItems = items.filter((item: any) => item.id !== id);
      this.setAll(filteredItems);
    } catch (error) {
      console.error(`Erro ao remover item ${id} de ${this.key}:`, error);
    }
  }

  /**
   * Remove todos os itens
   */
  clear(): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Erro ao limpar ${this.key}:`, error);
    }
  }

  /**
   * Verifica se a lista está vazia
   */
  isEmpty(): boolean {
    if (!this.isBrowser()) {
      return true;
    }

    try {
      const items = this.getAll();
      return items.length === 0;
    } catch (error) {
      console.error(`Erro ao verificar se ${this.key} está vazio:`, error);
      return true;
    }
  }

  /**
   * Verifica se existe algum item com determinado critério
   */
  exists(predicate: (item: T) => boolean): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    try {
      const items = this.getAll();
      return items.some(predicate);
    } catch (error) {
      console.error(`Erro ao verificar existência em ${this.key}:`, error);
      return false;
    }
  }

  /**
   * Filtra itens baseado em um critério
   */
  filter(predicate: (item: T) => boolean): T[] {
    if (!this.isBrowser()) {
      return [];
    }

    try {
      const items = this.getAll();
      return items.filter(predicate);
    } catch (error) {
      console.error(`Erro ao filtrar ${this.key}:`, error);
      return [];
    }
  }
}