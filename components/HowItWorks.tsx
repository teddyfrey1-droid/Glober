const STEPS = [
  {
    n: "1",
    title: "Tu décris ton besoin",
    desc: "Un brief par livrables — jamais d’horaires imposés — et la fenêtre de chevauchement qui t’arrange (ex. 3 h communes par jour).",
  },
  {
    n: "2",
    title: "On matche + on briefe le Binôme",
    desc: "Un profil senior vetté, sélectionné sur ta verticale et ton fuseau. Plus un binôme de secours, prêt à reprendre en moins de 4 h.",
  },
  {
    n: "3",
    title: "La livraison tourne en continu",
    desc: "Le travail avance pendant que tu dors. Paiement sécurisé à la validation du livrable, notation mutuelle à la clé.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-ink py-20 text-sand">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            Comment ça marche
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Trois étapes, zéro mauvaise surprise
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="relative rounded-4xl bg-white/5 p-7 ring-1 ring-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-lg font-bold text-white">
                {step.n}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
