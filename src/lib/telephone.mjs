/**
 * Numéro français → format international E.164 (+33…), ou null si le format n'est pas reconnu.
 * Accepte '03 86 00 00 00', '06.12.34.56.78', '+33 6 12 34 56 78', '+33 (0)6…', '0033 6…', '33612345678'.
 */
export function versE164(numero) {
  if (!numero) return null;
  let n = String(numero).replace(/\(0\)/g, '').replace(/[\s.\-()]/g, '');
  if (n.startsWith('00')) n = `+${n.slice(2)}`;
  if (/^0[1-9]\d{8}$/.test(n)) n = `+33${n.slice(1)}`;
  if (/^33[1-9]\d{8}$/.test(n)) n = `+${n}`;
  return /^\+33[1-9]\d{8}$/.test(n) ? n : null;
}
