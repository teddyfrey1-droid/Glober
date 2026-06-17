-- ============================================================================
-- Latitude — RLS « cross-acteur » pour le matching v1 (Phase 5)
--
-- Ouvre, en lecture seule et UNIQUEMENT sur les profils VETTÉS, ce dont une
-- entreprise a besoin pour matcher : profils, scores, fenêtres de dispo.
-- Gère les `matches`.
--
-- NB : les prédicats relationnels passent par des fonctions SECURITY DEFINER
-- (ci-dessous) qui contournent la RLS — indispensable pour éviter la récursion
-- entre policies (matches <-> missions, cf. messagerie).
-- ============================================================================

-- ---- Helpers SECURITY DEFINER (bypass RLS) -------------------------------
create or replace function public.owns_mission(p_mission uuid) returns boolean
  language sql security definer stable set search_path = public as $$
  select exists (select 1 from missions mi join companies c on c.id = mi.company_id
                 where mi.id = p_mission and c.user_id = auth.uid());
$$;

create or replace function public.is_my_nomad(p_nomad uuid) returns boolean
  language sql security definer stable set search_path = public as $$
  select exists (select 1 from nomad_profiles np where np.id = p_nomad and np.user_id = auth.uid());
$$;

create or replace function public.nomad_in_mission(p_mission uuid) returns boolean
  language sql security definer stable set search_path = public as $$
  select exists (select 1 from matches m join nomad_profiles np on np.id = m.nomad_id
                 where m.mission_id = p_mission and np.user_id = auth.uid());
$$;

create or replace function public.is_match_party(p_match uuid) returns boolean
  language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from matches m
    left join missions mi on mi.id = m.mission_id
    left join companies c  on c.id = mi.company_id
    left join nomad_profiles np on np.id = m.nomad_id
    where m.id = p_match and (c.user_id = auth.uid() or np.user_id = auth.uid())
  );
$$;

-- ---- Lecture des profils VETTÉS (en plus des policies owner) --------------
drop policy if exists "nomad_profiles_select_vetted" on public.nomad_profiles;
create policy "nomad_profiles_select_vetted" on public.nomad_profiles
  for select to authenticated using (status = 'vetted');

drop policy if exists "availability_select_vetted" on public.availability;
create policy "availability_select_vetted" on public.availability
  for select to authenticated
  using (exists (select 1 from public.nomad_profiles np
                 where np.id = availability.nomad_id and np.status = 'vetted'));

drop policy if exists "nomad_scores_select_vetted" on public.nomad_scores;
create policy "nomad_scores_select_vetted" on public.nomad_scores
  for select to authenticated
  using (exists (select 1 from public.nomad_profiles np
                 where np.id = nomad_scores.nomad_id and np.status = 'vetted'));

-- ---- Matches -------------------------------------------------------------
grant insert, update, delete on public.matches to authenticated;

-- L'entreprise propriétaire de la mission gère les matches (CRUD).
drop policy if exists "matches_company_all" on public.matches;
create policy "matches_company_all" on public.matches
  for all to authenticated
  using (public.owns_mission(mission_id))
  with check (public.owns_mission(mission_id));

-- Le nomade voit les matches qui le concernent.
drop policy if exists "matches_nomad_select" on public.matches;
create policy "matches_nomad_select" on public.matches
  for select to authenticated
  using (public.is_my_nomad(nomad_id));
