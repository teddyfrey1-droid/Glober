import Link from "next/link";
import { ScoreGauge } from "./ScoreGauge";
import { proposeMatch } from "@/app/missions/actions";

const EMOJI: Record<string, string> = { video: "🎬", dev: "💻", growth: "📈" };

export type MatchNomad = {
  id: string;
  headline: string | null;
  vertical: string | null;
  city: string | null;
  country: string | null;
  timezone: string | null;
  overlap: number;
  dayRate: number | null;
  score: { punctuality: number; quality: number; availability: number; global: number | null };
  existingRole: "primary" | "backup" | null;
  matchId: string | null;
};

export function NomadMatchCard({
  missionId,
  nomad,
}: {
  missionId: string;
  nomad: MatchNomad;
}) {
  const n = nomad;
  const matched = n.existingRole && n.matchId;

  return (
    <div className="rounded-4xl bg-white p-5 shadow-soft ring-1 ring-ink/5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink/5 text-xl">
          {EMOJI[n.vertical ?? ""] ?? "🌍"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-ink">{n.headline ?? "Profil"}</h3>
            {n.existingRole && (
              <span className="shrink-0 rounded-full bg-jade/10 px-2 py-0.5 text-[10px] font-semibold text-ink ring-1 ring-jade/30">
                {n.existingRole === "primary" ? "Primary proposé" : "Binôme proposé"}
              </span>
            )}
          </div>
          <p className="text-sm text-ink/60">
            {n.city}
            {n.country ? ` · ${n.country}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-ink/50">
            {n.timezone ?? "—"} · 🕑 ≈ {n.overlap} h communes
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl bg-sand/70 p-3">
        <ScoreGauge label="Ponctualité" value={n.score.punctuality} />
        <ScoreGauge label="Qualité" value={n.score.quality} />
        <ScoreGauge label="Disponibilité" value={n.score.availability} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-ink/60">
          {n.dayRate ? (
            <>
              dès <strong className="text-ink">{n.dayRate} €</strong>/j
            </>
          ) : (
            "TJM sur demande"
          )}
        </span>

        {matched ? (
          <Link
            href={`/threads/${n.matchId}`}
            className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-sand transition hover:brightness-110"
          >
            Discuter →
          </Link>
        ) : (
          <div className="flex gap-2">
            <form action={proposeMatch}>
              <input type="hidden" name="mission_id" value={missionId} />
              <input type="hidden" name="nomad_id" value={n.id} />
              <input type="hidden" name="role" value="primary" />
              <button className="rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105">
                Proposer
              </button>
            </form>
            <form action={proposeMatch}>
              <input type="hidden" name="mission_id" value={missionId} />
              <input type="hidden" name="nomad_id" value={n.id} />
              <input type="hidden" name="role" value="backup" />
              <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-sand transition hover:brightness-110">
                + Binôme
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
