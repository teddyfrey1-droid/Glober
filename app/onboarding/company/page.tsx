import { redirect } from "next/navigation";
import { AuthShell, inputClass, labelClass, Notice } from "@/components/AuthShell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { saveCompanyOnboarding } from "@/app/onboarding/actions";
import { COMPANY_COUNTRIES } from "@/lib/constants";

export const metadata = { title: "Ton espace entreprise — Latitude" };

export default async function CompanyOnboarding({
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
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) redirect("/dashboard");

  return (
    <AuthShell
      title="Ton espace entreprise"
      subtitle="Quelques infos pour préparer tes missions par livrables."
    >
      {searchParams.error && <Notice kind="error">{searchParams.error}</Notice>}

      <form action={saveCompanyOnboarding} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>Nom de l’entreprise</label>
          <input id="name" name="name" required placeholder="Ton entreprise" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="country" className={labelClass}>Pays</label>
            <select id="country" name="country" className={inputClass} defaultValue="">
              <option value="" disabled>Choisis…</option>
              {COMPANY_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="size" className={labelClass}>Taille</label>
            <select id="size" name="size" className={inputClass} defaultValue="">
              <option value="" disabled>Choisis…</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-200">51–200</option>
              <option value="200+">200+</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="plan" className={labelClass}>Formule</label>
          <select id="plan" name="plan" className={inputClass} defaultValue="studio">
            <option value="studio">Studio — 1 mission (~290 €/mois)</option>
            <option value="continu">Continu — jusqu’à 3 missions + Binôme (~690 €/mois)</option>
            <option value="scale">Scale — sur devis</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
        >
          Créer mon espace
        </button>
      </form>
    </AuthShell>
  );
}
