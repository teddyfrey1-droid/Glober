const VERTICALS = [
  {
    emoji: "🎬",
    title: "Vidéo / montage",
    desc: "Monteurs, motion designers, vidéastes. Du rush au livrable final, en flux continu.",
  },
  {
    emoji: "💻",
    title: "Dev / no-code / product",
    desc: "Devs, no-coders, product builders. Ton produit avance pendant la nuit.",
  },
  {
    emoji: "📈",
    title: "Marketing / growth / contenu",
    desc: "Growth, SEO, social, copywriting. Du contenu qui tourne sans relâche.",
  },
];

export function Verticals() {
  return (
    <section id="verticals" className="border-y border-ink/5 bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            Verticales de lancement
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            On commence là où le remote est déjà roi
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VERTICALS.map((v) => (
            <div
              key={v.title}
              className="group rounded-4xl bg-sand/60 p-7 ring-1 ring-ink/5 transition hover:bg-sand"
            >
              <div className="text-4xl">{v.emoji}</div>
              <h3 className="mt-4 text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
