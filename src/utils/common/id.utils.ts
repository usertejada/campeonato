// src/utils/common/id.utils.ts

/**
 * Gera um ID único baseado em timestamp e string aleatória
 */
export function generateUniqueId(prefix: string = 'id'): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${randomStr}`;
}

/**
 * Gera ID único garantindo que não existe na lista fornecida
 */
export function generateUniqueIdWithCheck<T extends { id: string }>(
  existingItems: T[],
  prefix: string = 'id',
  maxAttempts: number = 100
): string {
  let id: string;
  let attempts = 0;

  do {
    id = generateUniqueId(prefix);
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error('Não foi possível gerar ID único');
    }
  } while (existingItems.some(item => item.id === id));

  return id;
}