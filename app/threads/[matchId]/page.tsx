import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { sendMessage } from "@/app/threads/actions";
import { generateContract } from "@/app/contracts/actions";
import { leaveReview } from "@/app/reviews/actions";
import { inputClass } from "@/components/AuthShell";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Discussion — Latitude" };

function clock(ts: string): string {
  return new Date(ts).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Thread({
  params,
  searchParams,
}: {
  params: { matchId: string };
  searchParams: { error?: string; reviewed?: string };
}) {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS : lisible seulement si l'utilisateur est partie du match.
  const { data: match } = await supabase
    .from("matches")
    .select("id, mission_id, nomad_id, role")
    .eq("id", params.matchId)
    .maybeSingle();
  if (!match) redirect("/dashboard");

  const [{ data: mission }, { data: nomad }, { data: messages }] = await Promise.all([
    supabase.from("missions").select("id, title").eq("id", match.mission_id).maybeSingle(),
    supabase.from("nomad_profiles").select("headline, city").eq("id", match.nomad_id).maybeSingle(),
    supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("match_id", match.id)
      .order("created_at", { ascending: true }),
  ]);

  const [{ data: contract }, { data: profile }] = await Promise.all([
    supabase.from("contracts").select("id, reference, signed_at").eq("match_id", match.id).maybeSingle(),
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
  ]);
  const isCompany =
    (profile?.role ?? (user.user_metadata?.role as string | undefined)) === "company";

  const { data: myReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("mission_id", match.mission_id)
    .eq("author_id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <header className="bg-ink text-sand">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/dashboard">
            <Logo className="text-sand" />
          </Link>
          <Link
            href={`/missions/${match.mission_id}`}
            className="text-sm text-sand/70 transition hover:text-sand"
          >
            ← Mission
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-8">
        <div className="rounded-4xl bg-white p-5 shadow-soft ring-1 ring-ink/5">
          <h1 className="font-display text-xl font-bold text-ink">
            {mission?.title ?? "Discussion"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {nomad?.headline ?? "Profil"}
            {nomad?.city ? ` · ${nomad.city}` : ""} ·{" "}
            <span className="font-medium">
              {match.role === "backup" ? "Binôme" : "Primary"}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-4 text-sm shadow-soft ring-1 ring-ink/5">
          <span className="text-ink/70">
            🔐 <span className="font-semibold text-ink">Contrat B2B</span>{" "}
            {contract
              ? `· ${contract.reference}${contract.signed_at ? " · signé" : ""}`
              : "· pas encore généré"}
          </span>
          {contract ? (
            <Link
              href={`/contracts/${contract.id}`}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand transition hover:brightness-110"
            >
              Voir le contrat
            </Link>
          ) : isCompany ? (
            <form action={generateContract}>
              <input type="hidden" name="match_id" value={match.id} />
              <button className="rounded-full bg-coral px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-105">
                Générer le contrat
              </button>
            </form>
          ) : null}
        </div>

        <div className="mt-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink/5">
          <div className="mb-2 text-sm font-semibold text-ink">⭐ Évaluer la collaboration</div>
          {myReview ? (
            <p className="text-sm text-ink/60">
              Merci, ton avis est enregistré — il met à jour le Nomad Score.
            </p>
          ) : (
            <form action={leaveReview} className="space-y-3">
              <input type="hidden" name="match_id" value={match.id} />
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["punctuality", "Ponctualité"],
                  ["quality", "Qualité"],
                  ["availability", "Dispo"],
                ].map(([name, label]) => (
                  <label key={name} className="block text-xs text-ink/60">
                    {label}
                    <select
                      name={name}
                      required
                      defaultValue=""
                      className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-2 py-1.5 text-sm text-ink outline-none focus:border-coral"
                    >
                      <option value="" disabled>
                        —
                      </option>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <input
                name="comment"
                placeholder="Commentaire (optionnel)"
                className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-coral"
              />
              <button className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand transition hover:brightness-110">
                Envoyer l&rsquo;avis
              </button>
            </form>
          )}
        </div>

        {searchParams.reviewed && (
          <p className="mt-3 rounded-xl bg-jade/10 px-4 py-3 text-sm font-medium text-ink ring-1 ring-jade/30">
            Avis enregistré — le Nomad Score a été recalculé.
          </p>
        )}

        {searchParams.error && (
          <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-ink ring-1 ring-coral/30">
            {searchParams.error}
          </p>
        )}

        <div className="mt-6 flex-1 space-y-3">
          {messages && messages.length > 0 ? (
            messages.map((m) => {
              const mine = m.sender_id === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm ${
                      mine ? "bg-coral text-white" : "bg-white text-ink ring-1 ring-ink/5"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <div className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-ink/40"}`}>
                      {clock(m.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="rounded-4xl bg-white p-8 text-center text-sm text-ink/50 ring-1 ring-ink/5">
              Démarre la conversation — cale une fenêtre de chevauchement, parle livrables.
            </p>
          )}
        </div>

        <form action={sendMessage} className="sticky bottom-4 mt-6 flex gap-2">
          <input type="hidden" name="match_id" value={match.id} />
          <input
            name="body"
            required
            autoComplete="off"
            placeholder="Écris ton message…"
            className={`${inputClass} flex-1`}
          />
          <button
            type="submit"
            className="rounded-full bg-coral px-5 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            Envoyer
          </button>
        </form>
      </main>
    </div>
  );
}
