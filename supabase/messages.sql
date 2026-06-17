-- ============================================================================
-- Latitude — Messagerie (Phase 5) : un fil de messages par `match`.
--
-- Accès réservé aux 2 parties du match : l'entreprise propriétaire de la mission
-- ET le nomade concerné. Messages immuables (select + insert seulement).
--
-- Dépendance : les fonctions SECURITY DEFINER `is_match_party` / `nomad_in_mission`
-- sont définies dans matching.sql (elles cassent la récursion entre policies).
-- ============================================================================

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references public.matches(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (length(btrim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists messages_match_idx on public.messages (match_id, created_at);

alter table public.messages enable row level security;
grant select, insert on public.messages to authenticated;

-- Lecture/écriture réservées aux 2 parties du match.
drop policy if exists "messages_party_select" on public.messages;
create policy "messages_party_select" on public.messages
  for select to authenticated
  using (public.is_match_party(match_id));

drop policy if exists "messages_party_insert" on public.messages;
create policy "messages_party_insert" on public.messages
  for insert to authenticated
  with check (sender_id = auth.uid() and public.is_match_party(match_id));

-- Le nomade matché peut lire la mission (contexte du fil de discussion).
drop policy if exists "missions_select_matched_nomad" on public.missions;
create policy "missions_select_matched_nomad" on public.missions
  for select to authenticated
  using (public.nomad_in_mission(id));
