import Link from "next/link";
import { Logo } from "./Logo";

export const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-ink/30 focus:border-coral focus:ring-2 focus:ring-coral/20";

export const labelClass = "mb-1 block text-sm font-medium text-ink/70";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* Panneau de marque */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-sand md:flex">
        <div className="absolute inset-0 bg-map-lines opacity-60" aria-hidden="true" />
        <Link href="/" className="relative">
          <Logo className="text-sand" />
        </Link>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight">
            La liberté,
            <br />
            ça se gagne.
          </h2>
          <p className="mt-3 max-w-sm text-sand/70">
            Un senior au prix d&rsquo;un junior, une continuité de service garantie.
          </p>
        </div>
        <p className="relative text-xs text-sand/40">Latitude — modèle 100 % B2B.</p>
      </div>

      {/* Panneau formulaire */}
      <div className="flex items-center justify-center bg-sand p-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 md:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-ink/60">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}

export function Notice({
  kind,
  children,
}: {
  kind: "error" | "info" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    error: "bg-coral/10 ring-coral/30",
    info: "bg-amber/10 ring-amber/30",
    success: "bg-jade/10 ring-jade/30",
  }[kind];
  return (
    <p className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium text-ink ring-1 ${styles}`}>
      {children}
    </p>
  );
}
