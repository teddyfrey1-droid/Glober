import { redirect } from "next/navigation";
import { AuthShell, inputClass, labelClass, Notice } from "@/components/AuthShell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createMission } from "@/app/missions/actions";
import { VERTICALS } from "@/lib/constants";

export const metadata = { title: "Nouvelle mission — Latitude" };

export default async function NewMission({
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

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!company) redirect("/onboarding/company");

  return (
    <AuthShell
      title="Nouvelle mission"
      subtitle="Décris ton besoin par livrables — jamais par horaires."
    >
      {searchParams.error && <Notice kind="error">{searchParams.error}</Notice>}

      <form action={createMission} className="space-y-4">
        <div>
          <label htmlFor="title" className={labelClass}>Titre</label>
          <input id="title" name="title" required placeholder="Montage de 8 vidéos / mois" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="vertical" className={labelClass}>Verticale</label>
            <select id="vertical" name="vertical" required className={inputClass} defaultValue="">
              <option value="" disabled>Choisis…</option>
              {VERTICALS.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget_eur" className={labelClass}>Budget mensuel (€)</label>
            <input id="budget_eur" name="budget_eur" type="number" min="0" step="50" placeholder="2800" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="brief" className={labelClass}>Brief (livrables)</label>
          <textarea id="brief" name="brief" rows={3} placeholder="Ce que tu attends, en livrables concrets." className={inputClass} />
        </div>

        <div>
          <label htmlFor="desired_overlap_window" className={labelClass}>Fenêtre de chevauchement souhaitée</label>
          <input id="desired_overlap_window" name="desired_overlap_window" placeholder="14:00–17:00 CET" className={inputClass} />
          <p className="mt-1 text-xs text-ink/50">
            Une fenêtre de <strong>disponibilité commune</strong> à négocier — pas un horaire imposé.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
        >
          Créer &amp; voir les profils
        </button>
      </form>
    </AuthShell>
  );
}
