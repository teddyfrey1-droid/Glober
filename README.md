# Latitude

> **La liberté, ça se gagne.**
> La marketplace qui connecte des talents nomades diplômés avec des entreprises francophones — un profil senior au prix d'un junior, une continuité de service garantie.

Latitude est un **tiers de confiance B2B** : on ne vend pas du freelance à l'heure, on vend de la **continuité de service** et de la **sérénité juridique**. Un talent nomade (digital nomad diplômé, basé en Asie, Amérique du Sud, etc.) fait une concession sur le salaire contre une **liberté géographique totale** ; l'entreprise francophone (🇫🇷 🇨🇦 🇧🇪 🇨🇭) obtient un **profil senior au prix d'un junior**, sans charges patronales, avec une **fiabilité garantie**.

---

## Le modèle tri-gagnant

| Acteur | Ce qu'il gagne | Ce qu'il concède |
|--------|----------------|------------------|
| 🌍 **Nomade** | Revenu € stable et récurrent, liberté géographique, missions premium | Sélection ultra-stricte + notation continue (mauvais score = perte des contrats récurrents) |
| 🏢 **Entreprise** | Talent senior au prix d'un junior, zéro charge patronale FR, continuité garantie (Binôme), flexibilité | S'engage sur un cadre par livrables (pas d'horaires imposés) |
| 🛰️ **Latitude** | Revenu récurrent (abonnement + commission + FX), modèle valorisable | Porte la responsabilité du sérieux et de la continuité |

**Cercle vertueux** : bons profils → bonnes entreprises → budgets → revenus stables → bons profils.

---

## Features signature

- **🤝 Binôme / Redondance** — un 2ᵉ profil briefé reprend en **moins de 4 h** si le 1ᵉʳ décroche (vol, panne, maladie). Zéro interruption. *Personne d'autre ne l'offre.*
- **⭐ Nomad Score** — 3 piliers : **ponctualité · qualité · disponibilité**. La réputation est portable et se perd si on triche.
- **🕑 Time-Sync** — le décalage horaire vendu comme un atout : « ton dev bosse pendant que tu dors ».
- **🔐 Coffre-fort de conformité** — contrats B2B générés automatiquement, paiements et litiges gérés.

## Verticales de lancement

🎬 Vidéo / montage · 💻 Dev / no-code / product · 📈 Marketing / growth / contenu

---

## Stack technique

- **Front** : Next.js 14.2.x (App Router) · TypeScript · Tailwind CSS
- **Back / data** : Supabase (Auth, Postgres, Storage) — région `eu-west-3` (Paris, RGPD)
- **Paiements** (plus tard) : Stripe Billing + Connect
- **Hébergement** : Vercel
- **Design** : Figma

## Structure du repo

```
.
├── README.md                ← tu es ici
├── docs/                    ← Blueprint stratégique (Phase 0)
│   ├── 01-vision-modele-tri-gagnant.md
│   ├── 02-business-model-pricing-unit-economics.md
│   ├── 03-modele-legal-b2b-paiements.md
│   ├── 04-positionnement-concurrence-go-to-market.md
│   ├── 05-marque-direction-artistique.md
│   └── 06-mvp-perimetre-modele-de-donnees-roadmap.md
└── (app Next.js — arrive en Phase 1)
```

## Roadmap (vue d'ensemble)

- **Phase 0** ✅ Blueprint stratégique (ce dossier `docs/`)
- **Phase 1** 🔜 Landing désirable + waitlist double face (Entreprise / Nomade)
- **Phase 2** Supabase live (table `waitlist`, RLS, test bout-en-bout)
- **Phase 3** Déploiement Vercel
- **Phase 4** Logo + visuels (Figma)
- **Phase 5+** MVP marketplace (auth, onboarding, matching v1, Nomad Score, messagerie, Stripe)

Détail dans [`docs/06`](docs/06-mvp-perimetre-modele-de-donnees-roadmap.md).

---

> ⚠️ **Disclaimer juridique** — Les choix de structuration décrits dans ce repo (notamment le modèle 100 % B2B) ne constituent **pas un conseil juridique** et doivent être validés par un avocat avant mise en production. Voir [`docs/03`](docs/03-modele-legal-b2b-paiements.md).
