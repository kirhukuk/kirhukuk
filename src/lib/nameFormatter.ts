/**
 * Formats lawyer/attorney and office staff names into the standardized format:
 * - "Av. [Ad] [SOYAD]" (e.g. "Av. Abidin KIR", "Av. Elif YILMAZ")
 * - "Büro Personeli [Ad] [SOYAD]" (e.g. "Büro Personeli Fatma Büşra KIR")
 * - "Stj. Av. [Ad] [SOYAD]"
 * - "Katip [Ad] [SOYAD]"
 */
export function formatGivenNameAndSurname(nameStr: string): string {
  const tokens = nameStr.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '';
  if (tokens.length === 1) {
    const single = tokens[0];
    return single.charAt(0).toLocaleUpperCase('tr-TR') + single.slice(1).toLocaleLowerCase('tr-TR');
  }
  const surname = tokens[tokens.length - 1].toLocaleUpperCase('tr-TR');
  const firstNames = tokens.slice(0, -1).map(w => {
    return w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR');
  });
  return `${firstNames.join(' ')} ${surname}`;
}

export function formatTeamMemberName(rawName: string | undefined | null, _titleOrRole?: string | null): string {
  if (!rawName) return '';
  return rawName.trim();
}

export function formatLawyerName(rawName: string | undefined | null, _titleOrRole?: string | null): string {
  if (!rawName) return '';
  return rawName.trim();
}

