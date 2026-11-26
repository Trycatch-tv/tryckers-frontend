export interface CountryOption {
  /** Valor canónico aceptado y persistido por tryckers-backend (enums.Country). */
  value: string;
  /** Nombre legible para mostrar en la interfaz. */
  label: string;
  /** Código ISO-3166 alpha-2 solo para referencia visual y normalización heredada. */
  code: string;
  /** Bandera emoji para la UI. */
  flag: string;
}

export const COUNTRIES: readonly CountryOption[] = [
  { value: 'argentina', label: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { value: 'bolivia', label: 'Bolivia', code: 'BO', flag: '🇧🇴' },
  { value: 'brasil', label: 'Brasil', code: 'BR', flag: '🇧🇷' },
  { value: 'chile', label: 'Chile', code: 'CL', flag: '🇨🇱' },
  { value: 'colombia', label: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { value: 'costa rica', label: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
  { value: 'cuba', label: 'Cuba', code: 'CU', flag: '🇨🇺' },
  { value: 'ecuador', label: 'Ecuador', code: 'EC', flag: '🇪🇨' },
  { value: 'el salvador', label: 'El Salvador', code: 'SV', flag: '🇸🇻' },
  { value: 'guatemala', label: 'Guatemala', code: 'GT', flag: '🇬🇹' },
  { value: 'haiti', label: 'Haití', code: 'HT', flag: '🇭🇹' },
  { value: 'honduras', label: 'Honduras', code: 'HN', flag: '🇭🇳' },
  { value: 'mexico', label: 'México', code: 'MX', flag: '🇲🇽' },
  { value: 'nicaragua', label: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
  { value: 'panama', label: 'Panamá', code: 'PA', flag: '🇵🇦' },
  { value: 'paraguay', label: 'Paraguay', code: 'PY', flag: '🇵🇾' },
  { value: 'peru', label: 'Perú', code: 'PE', flag: '🇵🇪' },
  { value: 'puerto rico', label: 'Puerto Rico', code: 'PR', flag: '🇵🇷' },
  {
    value: 'republica dominicana',
    label: 'República Dominicana',
    code: 'DO',
    flag: '🇩🇴',
  },
  { value: 'spain', label: 'España', code: 'ES', flag: '🇪🇸' },
  { value: 'uruguay', label: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  { value: 'venezuela', label: 'Venezuela', code: 'VE', flag: '🇻🇪' },
];

const CANONICAL_COUNTRY_SET = new Set(COUNTRIES.map((c) => c.value));
const ISO_TO_CANONICAL_MAP = new Map(
  COUNTRIES.map((c) => [c.code.toLowerCase(), c.value]),
);

/**
 * Verifica si un valor corresponde exactamente a un país canónico soportado por el backend.
 */
export function isValidCanonicalCountry(
  value: string | null | undefined,
): boolean {
  if (!value) {
    return false;
  }
  return CANONICAL_COUNTRY_SET.has(value.trim().toLowerCase());
}

/**
 * Normaliza un valor de país proveniente del usuario/API hacia su representación canónica.
 * Devuelve '' si está ausente o no es compatible (nunca asigna un país por defecto).
 */
export function normalizeCountryValue(
  value: string | null | undefined,
): string {
  if (!value) {
    return '';
  }

  const normalized = value.trim().toLowerCase();
  if (CANONICAL_COUNTRY_SET.has(normalized)) {
    return normalized;
  }

  return ISO_TO_CANONICAL_MAP.get(normalized) ?? '';
}
