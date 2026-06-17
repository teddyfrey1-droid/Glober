-- ============================================================================
-- Latitude — Contrats B2B (Phase 5) : « coffre-fort de conformité ».
--
-- Étend `contracts` pour stocker un contrat de mission généré à partir d'un
-- match (snapshot texte). Accès : l'entreprise propriétaire gère ; les 2 parties
-- du match peuvent lire (via les helpers SECURITY DEFINER de matching.sql).
-- ============================================================================

alter table public.contracts
  add column if not exists match_id  uuid references public.matches(id) on delete cascade,
  add column if not exists body      text,
  add column if not exists reference text;

alter table public.contracts alter column type set default 'mission';
create index if not exists contracts_match_idx on public.contracts (match_id);

grant select, insert, update on public.contracts to authenticated;

-- L'entreprise propriétaire de la mission gère le contrat (CRUD).
drop policy if exists "contracts_company_all" on public.contracts;
create policy "contracts_company_all" on public.contracts
  for all to authenticated
  using (public.owns_mission(mission_id))
  with check (public.owns_mission(mission_id));

-- Les 2 parties du match peuvent lire le contrat.
drop policy if exists "contracts_party_select" on public.contracts;
create policy "contracts_party_select" on public.contracts
  for select to authenticated
  using (match_id is not null and public.is_match_party(match_id));
