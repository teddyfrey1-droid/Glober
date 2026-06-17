-- ============================================================================
-- Latitude — Auth : création automatique du profil à l'inscription (Phase 5)
--
-- À l'insertion d'un utilisateur dans auth.users, on crée la ligne public.profiles
-- correspondante. Le rôle (nomad|company) est lu depuis les métadonnées passées
-- à signUp(options.data.role). SECURITY DEFINER => fonctionne même avant la
-- confirmation d'email (la fonction s'exécute avec les droits du propriétaire,
-- elle n'est donc pas soumise à la RLS).
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'nomad'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
