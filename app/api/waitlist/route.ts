import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = new Set(["company", "nomad"]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Corps JSON invalide." },
      { status: 400 },
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const role = typeof data.role === "string" ? data.role : "";
  const vertical = typeof data.vertical === "string" ? data.vertical.trim() : "";
  const country = typeof data.country === "string" ? data.country.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Email invalide." }, { status: 400 });
  }
  if (!ROLES.has(role)) {
    return NextResponse.json({ ok: false, error: "Rôle invalide." }, { status: 400 });
  }

  const payload = {
    email,
    role,
    vertical: vertical || null,
    country: country || null,
  };

  const supabase = getSupabaseServerClient();

  // Mode démo : Supabase non configuré -> on logue et on ne plante jamais.
  if (!supabase) {
    console.log("[waitlist:demo]", payload);
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const { error } = await supabase.from("waitlist").insert(payload);

  if (error) {
    // 23505 = violation d'unicité (email+role déjà présent) -> succès idempotent.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, mode: "supabase", already: true });
    }
    console.error("[waitlist:error]", error.message);
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue. Réessaie dans un instant." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, mode: "supabase" });
}
