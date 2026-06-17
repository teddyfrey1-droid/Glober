"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function score(fd: FormData, k: string): number | null {
  const n = parseInt(String(fd.get(k) || ""), 10);
  return n >= 1 && n <= 5 ? n : null;
}

export async function leaveReview(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const matchId = String(formData.get("match_id") || "").trim();
  if (!matchId) redirect("/dashboard");

  const { data: match } = await supabase
    .from("matches")
    .select("mission_id")
    .eq("id", matchId)
    .maybeSingle();
  if (!match) redirect("/dashboard");

  // Contrepartie via fonction SECURITY DEFINER (chacun peut noter l'autre).
  const { data: target } = await supabase.rpc("match_counterparty", {
    p_match: matchId,
    p_me: user.id,
  });
  if (!target) {
    redirect(`/threads/${matchId}?error=${encodeURIComponent("Partie introuvable.")}`);
  }

  const { error } = await supabase.from("reviews").upsert(
    {
      mission_id: match.mission_id,
      author_id: user.id,
      target_id: target as string,
      punctuality: score(formData, "punctuality"),
      quality: score(formData, "quality"),
      availability: score(formData, "availability"),
      comment: String(formData.get("comment") || "").trim() || null,
    },
    { onConflict: "mission_id,author_id,target_id" },
  );

  if (error) {
    redirect(`/threads/${matchId}?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/threads/${matchId}?reviewed=1`);
}
