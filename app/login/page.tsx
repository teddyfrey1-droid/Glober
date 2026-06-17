import Link from "next/link";
import { AuthShell, inputClass, labelClass, Notice } from "@/components/AuthShell";
import { signIn } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Connexion — Latitude" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthShell title="Content de te revoir" subtitle="Connecte-toi à ton espace Latitude.">
      {!isSupabaseConfigured() && (
        <Notice kind="info">Supabase n&rsquo;est pas configuré sur cet environnement.</Notice>
      )}
      {searchParams.error && <Notice kind="error">{searchParams.error}</Notice>}

      <form action={signIn} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required placeholder="toi@exemple.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Mot de passe</label>
          <input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-semibold text-coral hover:underline">
          Crée ton compte
        </Link>
      </p>
    </AuthShell>
  );
}
