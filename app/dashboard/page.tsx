import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Tableau de bord — Latitude" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/5 py-2 text-sm last:border-0">
      <span className="text-ink/50">{label}</span>
      <span className="font-medium text-ink">{value || "—"}</span>
    </div>
  );
}

export default async function Dashboard() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const role =
    profile?.role ?? (user.user_metadata?.role as string | undefined) ?? "nomad";

  let card: React.ReactNode;
  if (role === "company") {
    const { data: co } = await supabase
      .from("companies")
      .select("name, plan, country, size")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!co) redirect("/onboarding/company");
    card = (
      <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
        <h2 className="font-display text-lg font-bold text-ink">{co.name || "Ton entreprise"}</h2>
        <p className="mb-3 text-sm text-ink/50">Espace entreprise</p>
        <Row label="Formule" value={co.plan} />
        <Row label="Pays" value={co.country ?? ""} />
        <Row label="Taille" value={co.size ?? ""} />
      </div>
    );
  } else {
    const { data: np } = await supabase
      .from("nomad_profiles")
      .select("headline, vertical, city, timezone, status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!np) redirect("/onboarding/nomad");
    card = (
      <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">{np.headline || "Ton profil"}</h2>
          <span className="rounded-full bg-amber/15 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-amber/30">
            {np.status === "vetted" ? "Vetté" : "En revue"}
          </span>
        </div>
        <Row label="Verticale" value={np.vertical ?? ""} />
        <Row label="Ville" value={np.city ?? ""} />
        <Row label="Fuseau" value={np.timezone ?? ""} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <header className="bg-ink text-sand">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/">
            <Logo className="text-sand" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-sand/70 sm:block">{user.email}</span>
            <form action={signOut}>
              <button className="rounded-full px-4 py-2 text-sm font-medium text-sand/80 ring-1 ring-white/20 transition hover:text-sand">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/60">
          {role === "company" ? "Espace entreprise" : "Espace nomade"}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">Bienvenue 👋</h1>
        <p className="mt-2 max-w-xl text-ink/60">
          Ton espace est prêt. Le matching v1, le Nomad Score et la messagerie arrivent — la
          base de données est déjà en place pour les accueillir.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {card}
          <div className="rounded-4xl bg-ink p-6 text-sand">
            <h2 className="font-display text-lg font-bold">Prochaines briques</h2>
            <ul className="mt-3 space-y-2 text-sm text-sand/75">
              <li>🔎 Matching v1 par règles (verticale + fuseau + dispo)</li>
              <li>⭐ Nomad Score (ponctualité · qualité · dispo)</li>
              <li>🤝 Binôme / Redondance</li>
              <li>💬 Messagerie &amp; abonnement Stripe</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
