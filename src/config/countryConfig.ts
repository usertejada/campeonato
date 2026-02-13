// src/config/countryConfig.ts

export interface CountryPhoneConfig {
  code: string;
  flag: string;
  name: string;
  phoneMask: string;
  placeholder: string;
}

/**
 * Configuração de códigos telefônicos disponíveis
 */
export const PHONE_COUNTRIES: CountryPhoneConfig[] = [
  {
    code: '+55',
    flag: '🇧🇷',
    name: 'Brasil',
    phoneMask: '(99) 99999-9999',
    placeholder: '(11) 98765-4321'
  },
  {
    code: '+57',
    flag: '🇨🇴',
    name: 'Colômbia',
    phoneMask: '999 999 9999',
    placeholder: '300 123 4567'
  },
  {
    code: '+51',
    flag: '🇵🇪',
    name: 'Peru',
    phoneMask: '999 999 999',
    placeholder: '987 654 321'
  }
];

/**
 * Retorna a configuração de país baseado no código telefônico
 */
export function getCountryByCode(code: string): CountryPhoneConfig | undefined {
  return PHONE_COUNTRIES.find(country => country.code === code);
}

/**
 * Formata número de telefone brasileiro
 * Exemplo: 11987654321 -> (11) 98765-4321
 */
export function formatPhoneBrazil(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Formata número de telefone colombiano
 * Exemplo: 3001234567 -> 300 123 4567
 */
export function formatPhoneColombia(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
  
  return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
}

/**
 * Formata número de telefone peruano
 * Exemplo: 987654321 -> 987 654 321
 */
export function formatPhonePeru(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
  
  return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`;
}

/**
 * Formata telefone baseado no código do país
 */
export function formatPhoneByCode(value: string, phoneCode: string): string {
  switch (phoneCode) {
    case '+55':
      return formatPhoneBrazil(value);
    case '+57':
      return formatPhoneColombia(value);
    case '+51':
      return formatPhonePeru(value);
    default:
      return value.replace(/\D/g, '');
  }
}

/**
 * Retorna o telefone completo com código do país
 */
export function getFullPhoneNumber(phone: string, phoneCode: string): string {
  return `${phoneCode} ${phone}`;
}

/**
 * Valida número de telefone baseado no código do país
 */
export function validatePhoneByCode(phone: string, phoneCode: string): boolean {
  const numbers = phone.replace(/\D/g, '');
  
  switch (phoneCode) {
    case '+55':
      return numbers.length === 11; // (11) 98765-4321
    case '+57':
      return numbers.length === 10; // 300 123 4567
    case '+51':
      return numbers.length === 9; // 987 654 321
    default:
      return false;
  }
}