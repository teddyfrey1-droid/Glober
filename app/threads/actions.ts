"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMessage(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const matchId = String(formData.get("match_id") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!matchId) redirect("/dashboard");
  if (!body) redirect(`/threads/${matchId}`);

  const { error } = await supabase
    .from("messages")
    .insert({ match_id: matchId, sender_id: user.id, body });

  if (error) {
    redirect(`/threads/${matchId}?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/threads/${matchId}`);
}
