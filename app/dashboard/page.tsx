import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Tableau de bord — Latitude" };

const VLABEL: Record<string, string> = {
  video: "Vidéo / montage",
  dev: "Dev / no-code / product",
  growth: "Marketing / growth / contenu",
};

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

  let main: React.ReactNode;

  if (role === "company") {
    const { data: co } = await supabase
      .from("companies")
      .select("id, name, plan, country, size")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!co) redirect("/onboarding/company");

    const { data: missions } = await supabase
      .from("missions")
      .select("id, title, vertical, status")
      .eq("company_id", co.id)
      .order("created_at", { ascending: false });

    main = (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
          <h2 className="font-display text-lg font-bold text-ink">{co.name || "Ton entreprise"}</h2>
          <p className="mb-3 text-sm text-ink/50">Espace entreprise</p>
          <Row label="Formule" value={co.plan} />
          <Row label="Pays" value={co.country ?? ""} />
          <Row label="Taille" value={co.size ?? ""} />
        </div>

        <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Tes missions</h2>
            <Link
              href="/missions/new"
              className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
            >
              + Nouvelle mission
            </Link>
          </div>
          {missions && missions.length > 0 ? (
            <ul className="divide-y divide-ink/5">
              {missions.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/missions/${m.id}`}
                    className="flex items-center justify-between py-3 transition hover:opacity-70"
                  >
                    <span>
                      <span className="font-medium text-ink">{m.title ?? "Mission"}</span>
                      <span className="ml-2 text-xs text-ink/50">{VLABEL[m.vertical ?? ""] ?? ""}</span>
                    </span>
                    <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-medium text-ink/60">
                      {m.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-sm text-ink/50">
              Aucune mission. Crée-en une pour voir les profils nomades recommandés.
            </p>
          )}
        </div>
      </div>
    );
  } else {
    const { data: np } = await supabase
      .from("nomad_profiles")
      .select("headline, vertical, city, timezone, status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!np) redirect("/onboarding/nomad");

    main = (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">{np.headline || "Ton profil"}</h2>
            <span className="rounded-full bg-amber/15 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-amber/30">
              {np.status === "vetted" ? "Vetté" : "En revue"}
            </span>
          </div>
          <Row label="Verticale" value={VLABEL[np.vertical ?? ""] ?? (np.vertical ?? "")} />
          <Row label="Ville" value={np.city ?? ""} />
          <Row label="Fuseau" value={np.timezone ?? ""} />
        </div>

        <div className="rounded-4xl bg-ink p-6 text-sand">
          <h2 className="font-display text-lg font-bold">Prochaines briques</h2>
          <ul className="mt-3 space-y-2 text-sm text-sand/75">
            <li>⭐ Nomad Score automatisé (ponctualité · qualité · dispo)</li>
            <li>🤝 Binôme / Redondance</li>
            <li>💬 Messagerie &amp; contrats B2B</li>
            <li>💳 Paiements (Stripe Connect, escrow)</li>
          </ul>
        </div>
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
          {role === "company"
            ? "Crée une mission par livrables et découvre les nomades vettés recommandés."
            : "Ton espace est prêt. Garde un Nomad Score élevé — c’est ce qui t’ouvre les contrats récurrents."}
        </p>
        <div className="mt-8">{main}</div>
      </main>
    </div>
  );
}
