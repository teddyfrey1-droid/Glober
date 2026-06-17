import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-sand">
        <a href="#top" aria-label="Latitude — accueil">
          <Logo />
        </a>
        <div className="hidden items-center gap-7 text-sm text-sand/75 md:flex">
          <a href="#diff" className="transition hover:text-sand">
            Différenciateurs
          </a>
          <a href="#how" className="transition hover:text-sand">
            Comment ça marche
          </a>
          <a href="#verticals" className="transition hover:text-sand">
            Verticales
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-sand/80 transition hover:text-sand sm:block"
          >
            Se connecter
          </Link>
          <a
            href="#waitlist"
            className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            Waitlist
          </a>
        </div>
      </nav>
    </header>
  );
}
