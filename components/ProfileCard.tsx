import { ScoreGauge } from "./ScoreGauge";

// Pièce maîtresse du hero : la carte profil "façon Airbnb" (cf. docs/05).
export function ProfileCard() {
  return (
    <div className="w-full max-w-sm rounded-4xl bg-white p-5 text-ink shadow-card ring-1 ring-ink/5">
      {/* En-tête : avatar + identité */}
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-sand">
          MR
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold leading-tight">Mathis R.</h3>
            <span className="shrink-0 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-ink ring-1 ring-amber/40">
              Premium Nomad
            </span>
          </div>
          <p className="text-sm text-ink/60">Monteur vidéo · Senior</p>
          <p className="mt-0.5 text-xs text-ink/50">📍 Bali · GMT+8</p>
        </div>
      </div>

      {/* Chip Time-Sync */}
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink/70">
        🕑 5 h de chevauchement avec Paris
      </div>

      {/* Nomad Score : 3 jauges */}
      <div className="mt-4 rounded-2xl bg-sand/70 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Nomad Score
          </span>
          <span className="text-sm font-bold text-ink">95</span>
        </div>
        <div className="space-y-2.5">
          <ScoreGauge label="Ponctualité" value={98} />
          <ScoreGauge label="Qualité" value={96} />
          <ScoreGauge label="Disponibilité" value={92} />
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-jade/10 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-jade/30">
          <span className="h-1.5 w-1.5 rounded-full bg-jade" /> Binôme actif
        </span>
        <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/70">
          🎬 Vidéo / montage
        </span>
      </div>

      {/* Pied : prix + CTA mock */}
      <div className="mt-5 flex items-center justify-between border-t border-ink/5 pt-4">
        <p className="text-sm text-ink/60">
          dès <span className="text-base font-bold text-ink">290 €</span>/mois
        </p>
        <span className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-sand">
          Voir le profil
        </span>
      </div>
    </div>
  );
}
