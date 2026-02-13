// src/config/documentConfig.ts

export type DocumentType = 'cpf' | 'rg' | 'dni_colombia' | 'dni_peru';

export interface DocumentConfig {
  type: DocumentType;
  label: string;
  placeholder: string;
  mask: string;
  validator?: (value: string) => boolean;
  formatter?: (value: string) => string;
}

export interface NationalityDocumentConfig {
  nationality: string;
  documents: DocumentConfig[];
}

/**
 * Configuração de documentos por nacionalidade
 */
export const NATIONALITY_DOCUMENTS: NationalityDocumentConfig[] = [
  {
    nationality: 'Brasileiro',
    documents: [
      {
        type: 'cpf',
        label: 'CPF',
        placeholder: '000.000.000-00',
        mask: '999.999.999-99',
      },
      {
        type: 'rg',
        label: 'RG',
        placeholder: '00.000.000-0',
        mask: '99.999.999-9',
      }
    ]
  },
  {
    nationality: 'Colombiano',
    documents: [
      {
        type: 'dni_colombia',
        label: 'DNI Colômbia',
        placeholder: '0.000.000.000',
        mask: '9.999.999.999',
      }
    ]
  },
  {
    nationality: 'Peruano',
    documents: [
      {
        type: 'dni_peru',
        label: 'DNI Peru',
        placeholder: '00000000',
        mask: '99999999',
      }
    ]
  }
];

/**
 * Retorna a configuração de documentos para uma nacionalidade específica
 */
export function getDocumentsByNationality(nationality: string): DocumentConfig[] {
  const config = NATIONALITY_DOCUMENTS.find(n => n.nationality === nationality);
  return config?.documents || [];
}

/**
 * Retorna o primeiro tipo de documento disponível para uma nacionalidade
 */
export function getDefaultDocumentType(nationality: string): DocumentType | null {
  const documents = getDocumentsByNationality(nationality);
  return documents.length > 0 ? documents[0].type : null;
}

/**
 * Verifica se um tipo de documento é válido para uma nacionalidade
 */
export function isDocumentValidForNationality(
  documentType: DocumentType, 
  nationality: string
): boolean {
  const documents = getDocumentsByNationality(nationality);
  return documents.some(doc => doc.type === documentType);
}

/**
 * Formata o DNI da Colômbia
 * Exemplo: 1121207851 -> 1.121.207.851
 */
export function formatDNIColombia(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 1) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 1)}.${numbers.slice(1)}`;
  if (numbers.length <= 7) return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4)}`;
  
  return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4, 7)}.${numbers.slice(7, 10)}`;
}

/**
 * Formata o DNI do Peru
 * Exemplo: 74991272 (apenas números, sem formatação)
 */
export function formatDNIPeru(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers.slice(0, 8);
}

/**
 * Valida DNI da Colômbia (10 dígitos)
 */
export function validateDNIColombia(value: string): boolean {
  const numbers = value.replace(/\D/g, '');
  return numbers.length === 10;
}

/**
 * Valida DNI do Peru (8 dígitos)
 */
export function validateDNIPeru(value: string): boolean {
  const numbers = value.replace(/\D/g, '');
  return numbers.length === 8;
}

/**
 * Retorna mensagem de erro para documento inválido
 */
export function getDocumentError(documentType: DocumentType, value: string): string | null {
  if (!value) return null;

  switch (documentType) {
    case 'dni_colombia':
      return validateDNIColombia(value) ? null : 'DNI deve ter 10 dígitos';
    case 'dni_peru':
      return validateDNIPeru(value) ? null : 'DNI deve ter 8 dígitos';
    default:
      return null;
  }
}

/**
 * Formata um valor de documento baseado no tipo
 */
export function formatDocumentValue(documentType: DocumentType, value: string): string {
  switch (documentType) {
    case 'dni_colombia':
      return formatDNIColombia(value);
    case 'dni_peru':
      return formatDNIPeru(value);
    default:
      return value;
  }
}