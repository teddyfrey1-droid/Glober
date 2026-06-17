# 06 — MVP : périmètre, modèle de données & roadmap

## 1. Objectif du MVP

Prouver le **cercle vertueux** sur **1–2 verticales** et **2–3 hubs** : des profils vettés, des entreprises qui paient en récurrent, une **continuité garantie** crédible (Binôme), le tout **conforme B2B**.

## 2. Périmètre — dans / hors

### ✅ Dans le MVP (Phases 1 → 5)
- Landing + **waitlist double face** (Phase 1).
- **Auth** Supabase (Phase 5).
- **Onboarding nomade** : profil, métier/verticale, portfolio, **vidéo d'intro**, fuseau, **fenêtres de dispo**.
- **Onboarding entreprise** : brief de mission.
- **Matching v1 par règles** : verticale + compétences + **recouvrement de fuseau** + dispo.
- **Nomad Score v1** (3 piliers) + reviews mutuelles.
- **Messagerie**.
- **Abonnement Stripe** (Billing).

### ⏳ Juste après le MVP
- **Contrats B2B générés** + **Stripe Connect** (escrow).
- **Binôme** (rôle backup) + **score automatisé**.

### ❌ Hors MVP (volontairement)
- Matching ML/algorithmique avancé (règles d'abord).
- Multi-devise FX automatisée complète.
- App mobile native.
- Toutes les verticales d'un coup.

## 3. Règle de design **non négociable** (conformité)

> **Aucun champ « horaires imposés » nulle part dans le schéma.**
> La seule donnée temporelle de coordination est une **`overlap_window`** : une **fenêtre de chevauchement négociée** (ex. « 14:00–17:00 CET »), jamais un planning imposé. Cf. `docs/03` (salariat déguisé).

## 4. Modèle de données (esquisse MVP)

```
users ─┬─ nomad_profiles ─┬─ portfolios
       │                  └─ availability (fenêtres / overlap)
       └─ companies

missions ─┬─ matches (role: primary | backup)   ← le Binôme
          ├─ contracts
          ├─ payments
          └─ reviews (mutuel, structuré) ─► nomad_scores
```

### Tables principales

| Table | Champs clés | Notes |
|-------|-------------|-------|
| `users` | id, email, role (`nomad`/`company`), created_at | Auth Supabase |
| `nomad_profiles` | user_id, métier, verticale, bio, ville, **timezone**, video_intro_url, langues, séniorité | **pas d'horaires** |
| `portfolios` | id, nomad_id, titre, url, média, description | Storage Supabase |
| `availability` | id, nomad_id, **overlap_window** (plage négociable), capacité (nb missions), statut | **jamais** un planning imposé |
| `companies` | user_id, nom, pays, taille, plan (studio/continu/scale) | |
| `missions` | id, company_id, verticale, brief (livrables), budget, **overlap_window souhaitée**, statut | orienté **livrables** |
| `matches` | id, mission_id, nomad_id, **role (`primary`/`backup`)**, statut | `backup` = **Binôme** |
| `contracts` | id, mission_id, type, doc_url, signé_le | « coffre-fort de conformité » |
| `payments` | id, mission_id, montant, devise, statut escrow, payout_id | Stripe Connect (post-MVP) |
| `reviews` | id, mission_id, auteur, cible, ponctualité, qualité, dispo, commentaire | **mutuel & structuré** |
| `nomad_scores` | nomad_id, ponctualité, qualité, dispo, score_global, maj_le | dérivé des reviews |

### Table `waitlist` (Phase 1 — déjà spécifiée)

```sql
waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('company','nomad')),
  vertical text,
  country text,
  created_at timestamptz not null default now(),
  unique (email, role)
)
```
- **RLS** : policy **INSERT only** depuis le client (clé **publishable** uniquement, **jamais** de service-role).
- Fichiers fournis en Phase 1 : `supabase/schema.sql` + `.env.example`.

## 5. Sécurité & conformité data

- **RLS systématique** sur toutes les tables.
- Clé **publishable** côté client ; **service-role jamais exposée** (server-only si besoin).
- Hébergement **`eu-west-3` (Paris)** — RGPD (cf. `docs/03`).
- Storage (portfolios, vidéos) avec policies d'accès dédiées.

## 6. Roadmap détaillée

| Phase | Livrable | État |
|-------|----------|------|
| **0** | Blueprint stratégique (README + `docs/01..06`) | ✅ |
| **1** | Landing désirable + waitlist double face ; `POST /api/waitlist` (Supabase si configuré, sinon **mode démo** qui ne plante pas) ; `supabase/schema.sql` + `.env.example` ; `npm run build` + smoke test | 🔜 |
| **2** | Projet Supabase `eu-west-3` ; migration `waitlist` + RLS ; **test d'insertion bout-en-bout** (insère → vérifie → supprime la donnée test) ; branchement `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` | ⏳ |
| **3** | Déploiement **Vercel** (CLI via token **ou** connexion repo dashboard) ; env `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` | ⏳ |
| **4** | **Logo + visuels** dans Figma (skill `/figma-use` avant `use_figma`) | ⏳ |
| **5** | MVP marketplace : auth ; onboarding nomade & entreprise ; **matching v1 par règles** ; Nomad Score v1 ; messagerie ; abonnement Stripe | 🔄 Data + auth + onboarding + matching v1 + messagerie + contrats B2B + **reviews & Nomad Score auto** livrés (RLS testée e2e) ; reste **Stripe** (clé requise) + Binôme auto |
| **5+** | Contrats B2B générés + Stripe Connect (escrow) ; puis **Binôme** + score automatisé | ⏳ |

## 7. Critères de passage (definition of done par phase)

- **Phase 1** : page d'accueil **HTTP 200**, `POST /api/waitlist` répond **OK** (insertion ou démo) et **400** sur payload invalide, `npm run build` **vert**.
- **Phase 2** : une inscription réelle crée **une ligne** en base, vérifiée puis **supprimée** ; RLS empêche tout sauf l'INSERT public.
- **Phase 3** : URL de prod accessible, env branchées, waitlist fonctionnelle en prod.
- **Phase 5** : un nomade et une entreprise peuvent s'inscrire, être **matchés par règles**, et échanger.
