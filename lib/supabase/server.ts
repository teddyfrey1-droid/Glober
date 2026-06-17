import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase server-side lié à la session de l'utilisateur (cookies).
// Utilisé par les Server Components et les Server Actions (auth + RLS).
// N'utilise QUE la clé publishable — jamais la service-role.

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component (cookies en lecture seule) :
            // ignoré, le middleware se charge de rafraîchir la session.
          }
        },
      },
    },
  );
}
