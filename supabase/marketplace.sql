-- ============================================================================
-- Latitude — Schéma marketplace (Phase 5, MVP)
-- Région : eu-west-3 (Paris, RGPD).
--
-- RÈGLE NON NÉGOCIABLE (conformité, cf. docs/03) :
--   AUCUN champ « horaires imposés ». La seule donnée de coordination temporelle
--   est `overlap_window` : une FENÊTRE DE CHEVAUCHEMENT NÉGOCIÉE, jamais un
--   planning imposé (anti-salariat déguisé).
--
-- Sécurité : RLS activée partout. Policies v1 « owner-scoped » (chaque user gère
--   ses propres lignes). Les tables relationnelles sensibles (matches, contracts,
--   payments, reviews, nomad_scores) restent VERROUILLÉES (RLS sans policy) et
--   seront ouvertes avec leurs features (accès serveur via service-role).
-- ============================================================================

-- ---- profils (extension de auth.users) -----------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('nomad','company')),
  email      text,
  full_name  text,
  created_at timestamptz not null default now()
);

-- ---- nomades --------------------------------------------------------------
create table if not exists public.nomad_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references public.profiles(id) on delete cascade,
  headline        text,
  vertical        text check (vertical in ('video','dev','growth')),
  bio             text,
  city            text,
  country         text,
  timezone        text,                 -- ex. 'Asia/Makassar' / 'GMT+8'
  languages       text[] default '{}',
  seniority       text,
  video_intro_url text,
  day_rate_eur    numeric(10,2),
  status          text not null default 'draft'
                  check (status in ('draft','pending_review','vetted','suspended')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
  -- NB : aucun champ « horaires ». La dispo passe par availability.overlap_window.
);

create table if not exists public.portfolios (
  id          uuid primary key default gen_random_uuid(),
  nomad_id    uuid not null references public.nomad_profiles(id) on delete cascade,
  title       text,
  url         text,
  media_url   text,
  description text,
  created_at  timestamptz not null default now()
);

-- Fenêtres de chevauchement NÉGOCIÉES (jamais d'horaires imposés).
create table if not exists public.availability (
  id             uuid primary key default gen_random_uuid(),
  nomad_id       uuid not null references public.nomad_profiles(id) on delete cascade,
  overlap_window text,                 -- ex. '14:00-17:00 CET' (négocié, non imposé)
  capacity       int default 1,
  status         text not null default 'open' check (status in ('open','limited','full')),
  created_at     timestamptz not null default now()
);

-- ---- entreprises ----------------------------------------------------------
create table if not exists public.companies (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.profiles(id) on delete cascade,
  name       text,
  country    text,
  size       text,
  plan       text not null default 'studio' check (plan in ('studio','continu','scale')),
  created_at timestamptz not null default now()
);

-- ---- missions (par livrables) --------------------------------------------
create table if not exists public.missions (
  id                     uuid primary key default gen_random_uuid(),
  company_id             uuid not null references public.companies(id) on delete cascade,
  title                  text,
  vertical               text check (vertical in ('video','dev','growth')),
  brief                  text,         -- livrables, jamais d'horaires
  budget_eur             numeric(10,2),
  desired_overlap_window text,         -- fenêtre négociée, non imposée
  status                 text not null default 'draft'
                         check (status in ('draft','open','matching','active','completed','cancelled')),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ---- matches (primary | backup = le Binôme) ------------------------------
create table if not exists public.matches (
  id         uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  nomad_id   uuid not null references public.nomad_profiles(id) on delete cascade,
  role       text not null check (role in ('primary','backup')),  -- backup = Binôme
  status     text not null default 'proposed'
             check (status in ('proposed','accepted','declined','active','ended')),
  created_at timestamptz not null default now(),
  unique (mission_id, nomad_id)
);

-- ---- contrats (coffre-fort de conformité) --------------------------------
create table if not exists public.contracts (
  id         uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  type       text check (type in ('framework','mission')),
  doc_url    text,
  signed_at  timestamptz,
  created_at timestamptz not null default now()
);

-- ---- paiements (escrow Stripe Connect) -----------------------------------
create table if not exists public.payments (
  id            uuid primary key default gen_random_uuid(),
  mission_id    uuid not null references public.missions(id) on delete cascade,
  amount_eur    numeric(10,2),
  currency      text not null default 'EUR',
  escrow_status text not null default 'pending'
                check (escrow_status in ('pending','held','released','refunded')),
  payout_ref    text,
  created_at    timestamptz not null default now()
);

-- ---- avis (mutuel, structuré : 3 piliers) --------------------------------
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  mission_id   uuid not null references public.missions(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  target_id    uuid not null references public.profiles(id) on delete cascade,
  punctuality  int check (punctuality  between 1 and 5),
  quality      int check (quality      between 1 and 5),
  availability int check (availability between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique (mission_id, author_id, target_id)
);

-- ---- Nomad Score (dérivé des reviews) ------------------------------------
create table if not exists public.nomad_scores (
  nomad_id     uuid primary key references public.nomad_profiles(id) on delete cascade,
  punctuality  numeric(5,2),
  quality      numeric(5,2),
  availability numeric(5,2),
  global_score numeric(5,2),
  updated_at   timestamptz not null default now()
);

-- ---- Index (clés étrangères) ---------------------------------------------
create index if not exists portfolios_nomad_idx   on public.portfolios (nomad_id);
create index if not exists availability_nomad_idx on public.availability (nomad_id);
create index if not exists missions_company_idx   on public.missions (company_id);
create index if not exists matches_mission_idx    on public.matches (mission_id);
create index if not exists matches_nomad_idx      on public.matches (nomad_id);
create index if not exists contracts_mission_idx  on public.contracts (mission_id);
create index if not exists payments_mission_idx   on public.payments (mission_id);
create index if not exists reviews_mission_idx    on public.reviews (mission_id);

-- ============================================================================
-- RLS : activer partout
-- ============================================================================
alter table public.profiles       enable row level security;
alter table public.nomad_profiles enable row level security;
alter table public.portfolios     enable row level security;
alter table public.availability   enable row level security;
alter table public.companies      enable row level security;
alter table public.missions       enable row level security;
alter table public.matches        enable row level security;
alter table public.contracts      enable row level security;
alter table public.payments       enable row level security;
alter table public.reviews        enable row level security;
alter table public.nomad_scores   enable row level security;

-- Privilèges (RLS reste le gardien au niveau ligne).
grant select, insert, update, delete on
  public.profiles, public.nomad_profiles, public.portfolios, public.availability,
  public.companies, public.missions to authenticated;
grant select on
  public.matches, public.contracts, public.payments, public.reviews, public.nomad_scores
  to authenticated;

-- ============================================================================
-- Policies v1 — « owner-scoped » (chaque utilisateur gère ses propres lignes).
-- Les tables relationnelles sensibles restent VERROUILLÉES (RLS sans policy) :
-- accès serveur via service-role, policies dédiées livrées avec leurs features.
-- ============================================================================

-- profiles : self
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles
  for select to authenticated using (id = auth.uid());
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- nomad_profiles : owner
drop policy if exists "nomad_profiles_owner_all" on public.nomad_profiles;
create policy "nomad_profiles_owner_all" on public.nomad_profiles
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- companies : owner
drop policy if exists "companies_owner_all" on public.companies;
create policy "companies_owner_all" on public.companies
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- portfolios : via nomad ownership
drop policy if exists "portfolios_owner_all" on public.portfolios;
create policy "portfolios_owner_all" on public.portfolios
  for all to authenticated
  using (exists (select 1 from public.nomad_profiles np where np.id = portfolios.nomad_id and np.user_id = auth.uid()))
  with check (exists (select 1 from public.nomad_profiles np where np.id = portfolios.nomad_id and np.user_id = auth.uid()));

-- availability : via nomad ownership
drop policy if exists "availability_owner_all" on public.availability;
create policy "availability_owner_all" on public.availability
  for all to authenticated
  using (exists (select 1 from public.nomad_profiles np where np.id = availability.nomad_id and np.user_id = auth.uid()))
  with check (exists (select 1 from public.nomad_profiles np where np.id = availability.nomad_id and np.user_id = auth.uid()));

-- missions : via company ownership
drop policy if exists "missions_owner_all" on public.missions;
create policy "missions_owner_all" on public.missions
  for all to authenticated
  using (exists (select 1 from public.companies c where c.id = missions.company_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.companies c where c.id = missions.company_id and c.user_id = auth.uid()));
