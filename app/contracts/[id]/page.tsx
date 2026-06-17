import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { markSigned } from "@/app/contracts/actions";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Contrat — Latitude" };

export default async function ContractPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, reference, body, signed_at, match_id")
    .eq("id", params.id)
    .maybeSingle();
  if (!contract) redirect("/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isCompany =
    (profile?.role ?? (user.user_metadata?.role as string | undefined)) === "company";

  return (
    <div className="min-h-screen bg-sand">
      <header className="bg-ink text-sand">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/dashboard">
            <Logo className="text-sand" />
          </Link>
          {contract.match_id && (
            <Link
              href={`/threads/${contract.match_id}`}
              className="text-sm text-sand/70 transition hover:text-sand"
            >
              ← Discussion
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-ink/60">
            🔐 <span className="font-semibold text-ink">Contrat B2B</span> · {contract.reference}
          </div>
          {contract.signed_at ? (
            <span className="rounded-full bg-jade/10 px-3 py-1 text-xs font-semibold text-ink ring-1 ring-jade/30">
              Signé
            </span>
          ) : (
            isCompany && (
              <form action={markSigned}>
                <input type="hidden" name="contract_id" value={contract.id} />
                <button className="rounded-full bg-coral px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-105">
                  Marquer comme signé
                </button>
              </form>
            )
          )}
        </div>

        {searchParams.error && (
          <p className="mb-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-ink ring-1 ring-coral/30">
            {searchParams.error}
          </p>
        )}

        <article className="rounded-4xl bg-white p-8 shadow-soft ring-1 ring-ink/5">
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-ink/90">
            {contract.body}
          </pre>
        </article>
      </main>
    </div>
  );
}
