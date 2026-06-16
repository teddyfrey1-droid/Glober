-- ============================================================================
-- Latitude — Migration : table `waitlist`  (Phase 1 / Phase 2)
-- Région cible : eu-west-3 (Paris, RGPD)
--
-- Sécurité : RLS activée, policy INSERT-ONLY pour le public (rôle anon).
--            Aucune lecture publique. Jamais de service-role côté app.
-- ============================================================================

create table if not exists public.waitlist (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null,
  role       text        not null check (role in ('company', 'nomad')),
  vertical   text,
  country    text,
  created_at timestamptz not null default now(),
  -- Une personne peut s'inscrire une fois par rôle (entreprise ET/OU nomade).
  constraint waitlist_email_role_unique unique (email, role)
);

-- Activer Row Level Security.
alter table public.waitlist enable row level security;

-- Privilèges minimaux : le public (anon) peut INSÉRER, rien d'autre.
grant insert on table public.waitlist to anon, authenticated;

-- Policy : INSERT autorisé pour tous (la validation métier est faite côté API).
drop policy if exists "waitlist_public_insert" on public.waitlist;
create policy "waitlist_public_insert"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- Pas de policy SELECT/UPDATE/DELETE => lecture/écriture impossibles via la
-- clé publishable. Les exports se font côté admin (service-role, hors app).

-- Index utile pour l'analyse (segmentation par rôle).
create index if not exists waitlist_role_idx on public.waitlist (role);
create index if not exists waitlist_created_at_idx on public.waitlist (created_at);
