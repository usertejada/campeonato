// ========================================
// src/utils/validators/documentValidators.ts
// ========================================

/**
 * Formata CPF: 12345678910 → 123.456.789-10
 */
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
}

/**
 * Formata RG: 123456789 → 12.345.678-9
 */
export function formatRG(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
}

/**
 * Remove formatação de documento
 */
export function removeDocumentFormatting(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida CPF (algoritmo oficial)
 */
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder >= 10 ? 0 : remainder;
  
  if (digit1 !== parseInt(numbers.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder >= 10 ? 0 : remainder;
  
  if (digit2 !== parseInt(numbers.charAt(10))) return false;
  
  return true;
}

/**
 * Valida RG (formato básico - apenas verifica se tem 9 dígitos)
 * Nota: RG não tem algoritmo de validação oficial como CPF
 */
export function validateRG(rg: string): boolean {
  const numbers = rg.replace(/\D/g, '');
  
  // RG brasileiro geralmente tem 9 dígitos
  if (numbers.length < 7 || numbers.length > 9) return false;
  
  // Verifica se não são todos dígitos iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  return true;
}

/**
 * Retorna mensagem de erro para documento inválido
 */
export function getDocumentErrorMessage(type: 'cpf' | 'rg', value: string): string | null {
  if (!value || value.trim() === '') return null;
  
  if (type === 'cpf') {
    if (!validateCPF(value)) {
      return 'CPF inválido';
    }
  } else if (type === 'rg') {
    if (!validateRG(value)) {
      return 'RG deve ter entre 7 e 9 dígitos';
    }
  }
  
  return null;
}