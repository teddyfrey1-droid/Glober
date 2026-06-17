import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { NomadMatchCard, type MatchNomad } from "@/components/NomadMatchCard";
import { matchScore, overlapHours, tzOffsetHours } from "@/lib/matching";

export const metadata = { title: "Mission — Latitude" };

const VLABEL: Record<string, string> = {
  video: "Vidéo / montage",
  dev: "Dev / no-code / product",
  growth: "Marketing / growth / contenu",
};

export default async function MissionDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS : seule l'entreprise propriétaire peut lire la mission (sinon null).
  const { data: mission } = await supabase
    .from("missions")
    .select("id, title, vertical, brief, budget_eur, desired_overlap_window, status")
    .eq("id", params.id)
    .maybeSingle();
  if (!mission) redirect("/dashboard");

  // Matches déjà proposés.
  const { data: matches } = await supabase
    .from("matches")
    .select("nomad_id, role")
    .eq("mission_id", mission.id);
  const matchBy = new Map((matches ?? []).map((m) => [m.nomad_id, m.role as "primary" | "backup"]));

  // Candidats : nomades vettés de la verticale de la mission.
  const { data: nomads } = await supabase
    .from("nomad_profiles")
    .select("id, headline, vertical, city, country, timezone, day_rate_eur")
    .eq("status", "vetted")
    .eq("vertical", mission.vertical ?? "");
  const list = nomads ?? [];
  const ids = list.map((n) => n.id);

  let scoreBy = new Map<string, any>();
  let availBy = new Map<string, any>();
  if (ids.length) {
    const [{ data: scores }, { data: avails }] = await Promise.all([
      supabase
        .from("nomad_scores")
        .select("nomad_id, global_score, punctuality, quality, availability")
        .in("nomad_id", ids),
      supabase
        .from("availability")
        .select("nomad_id, status")
        .in("nomad_id", ids),
    ]);
    scoreBy = new Map((scores ?? []).map((s) => [s.nomad_id, s]));
    (avails ?? []).forEach((a) => {
      if (!availBy.has(a.nomad_id)) availBy.set(a.nomad_id, a);
    });
  }

  const ranked = list
    .map((n): MatchNomad & { _total: number } => {
      const sc = scoreBy.get(n.id);
      const av = availBy.get(n.id);
      const open = av?.status === "open";
      const overlap = overlapHours(tzOffsetHours(n.timezone));
      const total = matchScore({
        vertical: n.vertical,
        timezone: n.timezone,
        availabilityOpen: open,
        score: sc?.global_score ?? null,
      });
      return {
        _total: total,
        id: n.id,
        headline: n.headline,
        vertical: n.vertical,
        city: n.city,
        country: n.country,
        timezone: n.timezone,
        overlap,
        dayRate: n.day_rate_eur,
        score: {
          punctuality: Number(sc?.punctuality ?? 0),
          quality: Number(sc?.quality ?? 0),
          availability: Number(sc?.availability ?? 0),
          global: sc?.global_score ?? null,
        },
        existingRole: matchBy.get(n.id) ?? null,
      };
    })
    .sort((a, b) => b._total - a._total);

  return (
    <div className="min-h-screen bg-sand">
      <header className="bg-ink text-sand">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard">
            <Logo className="text-sand" />
          </Link>
          <Link href="/dashboard" className="text-sm text-sand/70 transition hover:text-sand">
            ← Tableau de bord
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        {searchParams.error && (
          <p className="mb-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-ink ring-1 ring-coral/30">
            {searchParams.error}
          </p>
        )}

        {/* Résumé mission */}
        <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5">
          <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/60">
            {VLABEL[mission.vertical ?? ""] ?? "Mission"}
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink">{mission.title ?? "Mission"}</h1>
          {mission.brief && <p className="mt-2 max-w-2xl text-ink/70">{mission.brief}</p>}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink/60">
            {mission.budget_eur != null && <span>Budget : <strong className="text-ink">{mission.budget_eur} €/mois</strong></span>}
            {mission.desired_overlap_window && <span>Fenêtre : <strong className="text-ink">{mission.desired_overlap_window}</strong></span>}
            <span>Statut : <strong className="text-ink">{mission.status}</strong></span>
          </div>
        </div>

        {/* Profils proposés par le matching */}
        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold text-ink">
            Profils recommandés <span className="text-ink/40">({ranked.length})</span>
          </h2>
          <span className="text-sm text-ink/50">classés par verticale + fuseau + dispo</span>
        </div>

        {ranked.length === 0 ? (
          <p className="mt-6 rounded-4xl bg-white p-8 text-center text-ink/60 ring-1 ring-ink/5">
            Aucun profil vetté sur cette verticale pour l’instant. La supply se densifie hub par hub.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ranked.map((n) => (
              <NomadMatchCard key={n.id} missionId={mission.id} nomad={n} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
