-- ============================================================================
-- Latitude — Données de démo : nomades vettés (Phase 5, matching v1)
--
-- ⚠️ DONNÉES DE DÉMO. Crée 4 nomades vettés (emails @demo.latitude.test) pour
-- que le matching ait de la matière. Purge possible :
--   delete from auth.users where email like '%@demo.latitude.test';
-- (le cascade nettoie profiles, nomad_profiles, availability, nomad_scores).
-- ============================================================================

-- 1) Utilisateurs auth (le trigger handle_new_user crée les profiles).
insert into auth.users
  (instance_id, id, aud, role, email, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'mathis@demo.latitude.test', now(), now(), now(), '{}'::jsonb, '{"role":"nomad"}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'lina@demo.latitude.test',   now(), now(), now(), '{}'::jsonb, '{"role":"nomad"}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'hugo@demo.latitude.test',   now(), now(), now(), '{}'::jsonb, '{"role":"nomad"}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'sofia@demo.latitude.test',  now(), now(), now(), '{}'::jsonb, '{"role":"nomad"}'::jsonb)
on conflict do nothing;

-- Noms d'affichage.
update public.profiles set full_name = 'Mathis R.' where email = 'mathis@demo.latitude.test';
update public.profiles set full_name = 'Lina T.'   where email = 'lina@demo.latitude.test';
update public.profiles set full_name = 'Hugo M.'   where email = 'hugo@demo.latitude.test';
update public.profiles set full_name = 'Sofia K.'  where email = 'sofia@demo.latitude.test';

-- 2) Profils nomades (vettés).
insert into public.nomad_profiles
  (user_id, headline, vertical, bio, city, country, timezone, languages, seniority, day_rate_eur, status)
select u.id, v.headline, v.vertical, v.bio, v.city, v.country, v.timezone, v.languages, v.seniority, v.day_rate, 'vetted'
from (values
  ('mathis@demo.latitude.test', 'Monteur vidéo senior',     'video',  'Montage rapide, motion design, sous-titrage.', 'Bali',     'Indonésie (Bali)', 'GMT+8', array['Français','Anglais'],            'senior',    260),
  ('lina@demo.latitude.test',   'Développeuse full-stack',  'dev',    'React/Node, orientation produit.',            'Mexico',   'Mexique',          'GMT-6', array['Français','Anglais','Espagnol'],  'senior',    300),
  ('hugo@demo.latitude.test',   'Growth & SEO',             'growth', 'Acquisition, contenu, SEO technique.',        'Lisbonne', 'Portugal',         'GMT+0', array['Français','Anglais'],            'confirmed', 240),
  ('sofia@demo.latitude.test',  'Développeuse mobile',      'dev',    'Flutter / React Native.',                     'Bangkok',  'Thaïlande',        'GMT+7', array['Français','Anglais'],            'senior',    280)
) as v(email, headline, vertical, bio, city, country, timezone, languages, seniority, day_rate)
join auth.users u on u.email = v.email
on conflict (user_id) do nothing;

-- 3) Disponibilités (fenêtres de chevauchement négociées).
insert into public.availability (nomad_id, overlap_window, capacity, status)
select np.id, v.win, 2, 'open'
from (values
  ('mathis@demo.latitude.test', '14:00–17:00 CET'),
  ('lina@demo.latitude.test',   '16:00–19:00 CET'),
  ('hugo@demo.latitude.test',   '09:00–18:00 CET'),
  ('sofia@demo.latitude.test',  '13:00–16:00 CET')
) as v(email, win)
join auth.users u on u.email = v.email
join public.nomad_profiles np on np.user_id = u.id
on conflict do nothing;

-- 4) Nomad Scores.
insert into public.nomad_scores (nomad_id, punctuality, quality, availability, global_score)
select np.id, v.p, v.q, v.a, round((v.p + v.q + v.a) / 3.0, 1)
from (values
  ('mathis@demo.latitude.test', 98, 96, 92),
  ('lina@demo.latitude.test',   95, 97, 90),
  ('hugo@demo.latitude.test',   90, 91, 93),
  ('sofia@demo.latitude.test',  93, 89, 95)
) as v(email, p, q, a)
join auth.users u on u.email = v.email
join public.nomad_profiles np on np.user_id = u.id
on conflict (nomad_id) do nothing;
