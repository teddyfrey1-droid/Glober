// Constantes partagées (copy, verticales, pays). Cf. docs/04 & docs/05.

export type Role = "company" | "nomad";

export const VERTICALS = [
  { id: "video", label: "Vidéo / montage", emoji: "🎬" },
  { id: "dev", label: "Dev / no-code / product", emoji: "💻" },
  { id: "growth", label: "Marketing / growth / contenu", emoji: "📈" },
] as const;

// Pays côté entreprise (francophonie) vs hubs nomades concentrés (cf. docs/04).
export const COMPANY_COUNTRIES = [
  "France",
  "Québec / Canada",
  "Belgique",
  "Suisse",
  "Luxembourg",
  "Autre",
] as const;

export const NOMAD_COUNTRIES = [
  "Indonésie (Bali)",
  "Thaïlande",
  "Vietnam",
  "Mexique",
  "Colombie",
  "Portugal",
  "Autre",
] as const;

export const HERO_COPY: Record<
  Role,
  {
    eyebrow: string;
    title: string;
    highlight: string;
    sub: string;
    cta: string;
    points: string[];
  }
> = {
  company: {
    eyebrow: "Pour les entreprises",
    title: "Un senior au prix d’un junior.",
    highlight: "Et il ne tombe jamais en panne.",
    sub: "Latitude branche ton équipe à des talents nomades diplômés. Zéro charge patronale, une continuité de service garantie, une conformité B2B intégrée.",
    cta: "Rejoindre la waitlist",
    points: [
      "Zéro charge patronale FR",
      "Continuité garantie — Binôme < 4 h",
      "Conformité B2B intégrée",
    ],
  },
  nomad: {
    eyebrow: "Pour les nomades",
    title: "Gagne ta liberté par la rigueur.",
    highlight: "Ton talent n’a plus de fuseau.",
    sub: "Des missions premium, un revenu € stable et récurrent, une liberté géographique totale. En échange : une sélection stricte et un Nomad Score que tu fais grandir.",
    cta: "Postuler à la waitlist",
    points: [
      "Revenu € récurrent et prévisible",
      "Liberté géographique totale",
      "Réputation portable — Nomad Score",
    ],
  },
};
