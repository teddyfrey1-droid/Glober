import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-sand">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo className="text-sand" />
            <p className="mt-4 max-w-xs text-sm text-sand/60">
              La liberté, ça se gagne. La marketplace des talents nomades pour les
              entreprises francophones.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-sand">Produit</h4>
            <ul className="mt-4 space-y-2 text-sm text-sand/60">
              <li>
                <a href="#diff" className="transition hover:text-sand">
                  Différenciateurs
                </a>
              </li>
              <li>
                <a href="#how" className="transition hover:text-sand">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#verticals" className="transition hover:text-sand">
                  Verticales
                </a>
              </li>
              <li>
                <a href="#waitlist" className="transition hover:text-sand">
                  Waitlist
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-sand">Concept</h4>
            <ul className="mt-4 space-y-2 text-sm text-sand/60">
              <li>Binôme / Redondance</li>
              <li>Nomad Score</li>
              <li>Time-Sync</li>
              <li>Conformité B2B</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-sand/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} Latitude. Tous droits réservés.</p>
          <p className="max-w-xl md:text-right">
            Modèle 100 % B2B (le nomade facture en indépendant). Les informations de
            ce site ne constituent pas un conseil juridique.
          </p>
        </div>
      </div>
    </footer>
  );
}
