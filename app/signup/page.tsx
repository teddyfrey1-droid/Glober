import Link from "next/link";
import { AuthShell, inputClass, labelClass, Notice } from "@/components/AuthShell";
import { signUp } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Créer un compte — Latitude" };

const roleCard =
  "rounded-xl border border-ink/15 bg-white p-4 transition peer-checked:border-coral peer-checked:bg-coral/5 peer-focus-visible:ring-2 peer-focus-visible:ring-coral/30";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; notice?: string };
}) {
  return (
    <AuthShell title="Rejoins Latitude" subtitle="Crée ton compte en 30 secondes.">
      {!isSupabaseConfigured() && (
        <Notice kind="info">Supabase n&rsquo;est pas configuré sur cet environnement.</Notice>
      )}
      {searchParams.notice === "verify" && (
        <Notice kind="success">
          Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.
        </Notice>
      )}
      {searchParams.error && <Notice kind="error">{searchParams.error}</Notice>}

      <form action={signUp} className="space-y-4">
        <fieldset>
          <legend className={labelClass}>Je suis…</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input type="radio" name="role" value="company" defaultChecked className="peer sr-only" />
              <div className={roleCard}>
                <div className="font-semibold text-ink">Entreprise</div>
                <div className="text-xs text-ink/60">Je cherche un talent</div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="role" value="nomad" className="peer sr-only" />
              <div className={roleCard}>
                <div className="font-semibold text-ink">Nomade</div>
                <div className="text-xs text-ink/60">Je propose mon talent</div>
              </div>
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required placeholder="toi@exemple.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Mot de passe</label>
          <input id="password" name="password" type="password" required minLength={6} placeholder="6 caractères minimum" className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
        >
          Créer mon compte
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-semibold text-coral hover:underline">
          Connecte-toi
        </Link>
      </p>
    </AuthShell>
  );
}
