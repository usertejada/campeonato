// src/utils/formatters/inputFormatters.ts

/**
 * Formata número de telefone no padrão brasileiro
 * Ex: "11999887766" -> "(11) 99988-7766"
 * Ex: "1133334444" -> "(11) 3333-4444"
 */
export function formatPhone(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limited = numbers.slice(0, 11);
  
  // Aplica a máscara conforme o tamanho
  if (limited.length <= 2) {
    return limited;
  }
  
  if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  }
  
  if (limited.length <= 10) {
    // Telefone fixo: (11) 3333-4444
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  }
  
  // Celular: (11) 99988-7766
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
}

/**
 * Valida se o email tem formato válido
 * Retorna true se válido, false se inválido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formata email removendo espaços e convertendo para minúsculas
 */
export function formatEmail(value: string): string {
  return value.toLowerCase().trim();
}

/**
 * Remove a máscara do telefone e retorna apenas os números
 * Ex: "(11) 99988-7766" -> "11999887766"
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}