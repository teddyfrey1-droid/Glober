import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client Supabase server-side pour l'app.
// Utilise la CLÉ PUBLISHABLE (anon) — jamais la service-role.
// L'insertion en base est protégée par une policy RLS "INSERT only" (cf. supabase/schema.sql).

let cached: SupabaseClient | null | undefined;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    cached = null; // -> déclenche le "mode démo" côté API.
    return null;
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}
