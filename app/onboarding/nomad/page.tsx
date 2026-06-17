import { redirect } from "next/navigation";
import { AuthShell, inputClass, labelClass, Notice } from "@/components/AuthShell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { saveNomadOnboarding } from "@/app/onboarding/actions";
import { VERTICALS, NOMAD_COUNTRIES } from "@/lib/constants";

export const metadata = { title: "Ton profil nomade — Latitude" };

export default async function NomadOnboarding({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("nomad_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) redirect("/dashboard");

  return (
    <AuthShell
      title="Ton profil nomade"
      subtitle="Montre ce que tu sais faire. La sélection est stricte — c’est ce qui protège ta réputation."
    >
      {searchParams.error && <Notice kind="error">{searchParams.error}</Notice>}

      <form action={saveNomadOnboarding} className="space-y-4">
        <div>
          <label htmlFor="headline" className={labelClass}>Ton métier</label>
          <input id="headline" name="headline" required placeholder="Monteur vidéo senior" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="vertical" className={labelClass}>Verticale</label>
            <select id="vertical" name="vertical" className={inputClass} defaultValue="">
              <option value="" disabled>Choisis…</option>
              {VERTICALS.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="seniority" className={labelClass}>Séniorité</label>
            <select id="seniority" name="seniority" className={inputClass} defaultValue="">
              <option value="" disabled>Choisis…</option>
              <option value="confirmed">Confirmé</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="city" className={labelClass}>Ville</label>
            <input id="city" name="city" placeholder="Bali" className={inputClass} />
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>Pays / hub</label>
            <select id="country" name="country" className={inputClass} defaultValue="">
              <option value="" disabled>Choisis…</option>
              {NOMAD_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="timezone" className={labelClass}>Fuseau</label>
            <input id="timezone" name="timezone" placeholder="GMT+8" className={inputClass} />
          </div>
          <div>
            <label htmlFor="day_rate_eur" className={labelClass}>TJM indicatif (€)</label>
            <input id="day_rate_eur" name="day_rate_eur" type="number" min="0" step="10" placeholder="250" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="overlap_window" className={labelClass}>Fenêtre de chevauchement</label>
          <input id="overlap_window" name="overlap_window" placeholder="14:00–17:00 CET" className={inputClass} />
          <p className="mt-1 text-xs text-ink/50">
            Une fenêtre <strong>négociable</strong> de disponibilité commune — jamais un horaire imposé.
          </p>
        </div>

        <div>
          <label htmlFor="languages" className={labelClass}>Langues</label>
          <input id="languages" name="languages" placeholder="Français, Anglais" className={inputClass} />
        </div>

        <div>
          <label htmlFor="bio" className={labelClass}>Bio</label>
          <textarea id="bio" name="bio" rows={3} placeholder="En quelques lignes, ce qui fait ta valeur." className={inputClass} />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
        >
          Enregistrer mon profil
        </button>
      </form>
    </AuthShell>
  );
}
