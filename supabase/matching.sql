-- ============================================================================
-- Latitude — RLS « cross-acteur » pour le matching v1 (Phase 5)
--
-- Ouvre, en lecture seule et UNIQUEMENT sur les profils VETTÉS, ce dont une
-- entreprise a besoin pour matcher : profils, scores, fenêtres de dispo.
-- Gère les `matches` : l'entreprise propriétaire de la mission, et le nomade
-- concerné en lecture.
-- ============================================================================

-- Profils vettés : visibles par tout utilisateur authentifié (en plus de la
-- policy owner déjà en place -> combinées en OR).
drop policy if exists "nomad_profiles_select_vetted" on public.nomad_profiles;
create policy "nomad_profiles_select_vetted" on public.nomad_profiles
  for select to authenticated
  using (status = 'vetted');

-- Dispo des profils vettés.
drop policy if exists "availability_select_vetted" on public.availability;
create policy "availability_select_vetted" on public.availability
  for select to authenticated
  using (exists (
    select 1 from public.nomad_profiles np
    where np.id = availability.nomad_id and np.status = 'vetted'
  ));

-- Scores des profils vettés.
drop policy if exists "nomad_scores_select_vetted" on public.nomad_scores;
create policy "nomad_scores_select_vetted" on public.nomad_scores
  for select to authenticated
  using (exists (
    select 1 from public.nomad_profiles np
    where np.id = nomad_scores.nomad_id and np.status = 'vetted'
  ));

-- Matches : l'entreprise propriétaire de la mission gère (CRUD).
grant insert, update, delete on public.matches to authenticated;

drop policy if exists "matches_company_all" on public.matches;
create policy "matches_company_all" on public.matches
  for all to authenticated
  using (exists (
    select 1 from public.missions m
    join public.companies c on c.id = m.company_id
    where m.id = matches.mission_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.missions m
    join public.companies c on c.id = m.company_id
    where m.id = matches.mission_id and c.user_id = auth.uid()
  ));

-- Matches : le nomade voit ceux qui le concernent.
drop policy if exists "matches_nomad_select" on public.matches;
create policy "matches_nomad_select" on public.matches
  for select to authenticated
  using (exists (
    select 1 from public.nomad_profiles np
    where np.id = matches.nomad_id and np.user_id = auth.uid()
  ));
