-- ============================================================================
-- Latitude — Reviews mutuelles + Nomad Score automatisé (Phase 5)
--
-- Chaque partie d'un match note l'autre (ponctualité, qualité, dispo : 1–5).
-- Un trigger recalcule automatiquement public.nomad_scores du nomade noté
-- (moyenne des avis, ramenée sur 100). « Mauvais score = perte des contrats ».
-- ============================================================================

-- ---- Helpers SECURITY DEFINER (bypass RLS) -------------------------------
-- Vrai si p_a et p_b sont les 2 parties (entreprise/nomade) d'un match de la mission.
create or replace function public.are_mission_parties(p_mission uuid, p_a uuid, p_b uuid)
  returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.matches m
    join public.missions mi on mi.id = m.mission_id
    join public.companies c on c.id = mi.company_id
    join public.nomad_profiles np on np.id = m.nomad_id
    where mi.id = p_mission
      and ((c.user_id = p_a and np.user_id = p_b) or (c.user_id = p_b and np.user_id = p_a))
  );
$$;

-- Renvoie l'autre partie d'un match (pour adresser l'avis).
create or replace function public.match_counterparty(p_match uuid, p_me uuid)
  returns uuid language sql security definer stable set search_path = public as $$
  select case when c.user_id = p_me then np.user_id
              when np.user_id = p_me then c.user_id
              else null end
  from public.matches m
  join public.missions mi on mi.id = m.mission_id
  join public.companies c on c.id = mi.company_id
  join public.nomad_profiles np on np.id = m.nomad_id
  where m.id = p_match;
$$;

-- ---- Recalcul du Nomad Score (trigger) -----------------------------------
create or replace function public.recompute_nomad_score()
  returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_target uuid := coalesce(NEW.target_id, OLD.target_id);
  v_nomad  uuid;
  v_p numeric; v_q numeric; v_a numeric;
begin
  select np.id into v_nomad from public.nomad_profiles np where np.user_id = v_target;
  if v_nomad is null then
    return coalesce(NEW, OLD);  -- la cible n'est pas un nomade
  end if;

  select avg(r.punctuality) * 20, avg(r.quality) * 20, avg(r.availability) * 20
    into v_p, v_q, v_a
  from public.reviews r
  join public.nomad_profiles np on np.user_id = r.target_id
  where np.id = v_nomad;

  if v_p is null then
    delete from public.nomad_scores where nomad_id = v_nomad;  -- plus d'avis
    return coalesce(NEW, OLD);
  end if;

  insert into public.nomad_scores (nomad_id, punctuality, quality, availability, global_score, updated_at)
  values (v_nomad, round(v_p,1), round(v_q,1), round(v_a,1), round((v_p + v_q + v_a) / 3.0, 1), now())
  on conflict (nomad_id) do update set
    punctuality = excluded.punctuality, quality = excluded.quality,
    availability = excluded.availability, global_score = excluded.global_score, updated_at = now();

  return coalesce(NEW, OLD);
end; $$;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.recompute_nomad_score();

-- ---- RLS reviews ----------------------------------------------------------
grant select, insert, update on public.reviews to authenticated;

drop policy if exists "reviews_party_insert" on public.reviews;
create policy "reviews_party_insert" on public.reviews
  for insert to authenticated
  with check (author_id = auth.uid() and public.are_mission_parties(mission_id, author_id, target_id));

drop policy if exists "reviews_party_update" on public.reviews;
create policy "reviews_party_update" on public.reviews
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid() and public.are_mission_parties(mission_id, author_id, target_id));

drop policy if exists "reviews_party_select" on public.reviews;
create policy "reviews_party_select" on public.reviews
  for select to authenticated
  using (author_id = auth.uid() or target_id = auth.uid());
