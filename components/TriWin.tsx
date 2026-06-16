const COMPANY = {
  tag: "Entreprise",
  title: "Un talent premium, au prix d’un junior",
  gains: [
    "Profil senior à coût junior, zéro charge patronale FR",
    "Fiabilité garantie : Nomad Score + Binôme",
    "Conformité B2B et paiements sécurisés inclus",
    "Flexibilité totale, relation par livrables",
  ],
  concession: "Tu t’engages sur un cadre par livrables — et c’est aussi ta protection juridique.",
  accent: "text-coral",
  dot: "bg-coral",
};

const NOMAD = {
  tag: "Nomade",
  title: "Achète ta liberté par la rigueur",
  gains: [
    "Revenu € stable, récurrent et prévisible",
    "Liberté géographique totale",
    "Des missions premium, des clients sérieux",
    "Une réputation portable qui te suit",
  ],
  concession: "Sélection stricte et notation continue. La liberté, ça se gagne.",
  accent: "text-jade",
  dot: "bg-jade",
};

function WinCard({ data }: { data: typeof COMPANY }) {
  return (
    <div className="rounded-4xl bg-white p-8 shadow-soft ring-1 ring-ink/5">
      <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${data.accent}`}>
        {data.tag}
      </span>
      <h3 className="mt-3 text-2xl font-bold">{data.title}</h3>
      <ul className="mt-6 space-y-3">
        {data.gains.map((gain) => (
          <li key={gain} className="flex items-start gap-3 text-sm text-ink/75">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${data.dot}`} />
            {gain}
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-ink/5 pt-4 text-sm italic text-ink/50">
        {data.concession}
      </p>
    </div>
  );
}

export function TriWin() {
  return (
    <section className="bg-sand py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">Un modèle où tout le monde gagne</h2>
          <p className="mt-3 text-ink/60">
            Le nomade gagne sa liberté. L’entreprise gagne un senior fiable. Et la
            plateforme reste un tiers de confiance rentable.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <WinCard data={COMPANY} />
          <WinCard data={NOMAD} />
        </div>

        <div className="mt-6 rounded-4xl bg-ink px-8 py-6 text-sand">
          <p className="text-sm">
            <span className="font-semibold text-amber">Et Latitude&nbsp;?</span> Un
            tiers de confiance rentable : abonnement + commission + la continuité
            garantie en plus. Bons profils → bonnes entreprises → budgets → revenus
            stables → bons profils.
          </p>
        </div>
      </div>
    </section>
  );
}
