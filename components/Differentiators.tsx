const ITEMS = [
  {
    icon: "🤝",
    title: "Binôme / Redondance",
    desc: "Vol annulé, panne, fièvre ? Un 2ᵉ profil briefé reprend en moins de 4 h. Zéro interruption — personne d’autre ne l’offre.",
    accent: "bg-coral/10 ring-coral/20",
  },
  {
    icon: "🕑",
    title: "Time-Sync",
    desc: "Le décalage horaire devient ton équipe de nuit. Ton dev bosse pendant que tu dors, ton bug est réglé à ton réveil.",
    accent: "bg-amber/10 ring-amber/20",
  },
  {
    icon: "⭐",
    title: "Nomad Score",
    desc: "Ponctualité, qualité, disponibilité. Une réputation portable qui se construit — et se perd si on triche.",
    accent: "bg-jade/10 ring-jade/20",
  },
  {
    icon: "🔐",
    title: "Conformité B2B",
    desc: "Contrats générés automatiquement, paiements sécurisés par séquestre, litiges gérés. La sérénité juridique incluse.",
    accent: "bg-ink/5 ring-ink/10",
  },
];

export function Differentiators() {
  return (
    <section id="diff" className="border-b border-ink/5 bg-sand py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ce que personne d’autre ne garantit
          </h2>
          <p className="mt-3 text-ink/60">
            On ne vend pas du freelance à l’heure. On vend de la continuité de
            service et de la sérénité juridique.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-card"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ring-1 ${item.accent}`}
              >
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
