// Matching v1 par règles : verticale (filtre) + recouvrement de fuseau + dispo.
// Volontairement simple et lisible — pas de ML (cf. docs/06).

// Extrait un offset horaire depuis un texte type "GMT+8", "UTC-6", "+7".
export function tzOffsetHours(tz: string | null | undefined): number | null {
  if (!tz) return null;
  const m = tz.match(/([+-]\d{1,2})(?::?\d{2})?/);
  if (m) {
    const h = parseInt(m[1], 10);
    return Number.isFinite(h) ? h : null;
  }
  if (/gmt|utc/i.test(tz)) return 0;
  return null;
}

// Heures de chevauchement entre une journée 9–18 nomade et 9–18 chez le client.
// clientOffset par défaut = +1 (CET, cœur de cible francophone).
export function overlapHours(nomadOffset: number | null, clientOffset = 1): number {
  if (nomadOffset === null) return 0;
  const diff = nomadOffset - clientOffset; // décalage nomade vs client
  const start = Math.max(9, 9 - diff);
  const end = Math.min(18, 18 - diff);
  return Math.max(0, Math.round(end - start));
}

export type Candidate = {
  vertical: string | null;
  timezone: string | null;
  availabilityOpen: boolean;
  score: number | null;
};

// Score composite : qualité du profil + recouvrement de fuseau + disponibilité.
export function matchScore(c: Candidate, clientOffset = 1): number {
  const overlap = overlapHours(tzOffsetHours(c.timezone), clientOffset);
  const base = c.score ?? 0;
  const dispo = c.availabilityOpen ? 8 : 0;
  return Math.round(base + overlap * 3 + dispo);
}
