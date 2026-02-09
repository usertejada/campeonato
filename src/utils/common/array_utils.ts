// src/utils/common/array_utils.ts

/**
 * Embaralha array usando algoritmo Fisher-Yates
 * @param array - Array a ser embaralhado
 * @returns Novo array embaralhado (não modifica o original)
 */
export function embaralhar<T>(array: T[]): T[] {
  const resultado = [...array];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

/**
 * Remove elementos duplicados de um array
 * @param array - Array com possíveis duplicatas
 * @returns Novo array sem duplicatas
 */
export function removerDuplicatas<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Divide array em chunks (pedaços) de tamanho específico
 * @param array - Array a ser dividido
 * @param tamanho - Tamanho de cada chunk
 * @returns Array de chunks
 */
export function dividirEmChunks<T>(array: T[], tamanho: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += tamanho) {
    chunks.push(array.slice(i, i + tamanho));
  }
  return chunks;
}