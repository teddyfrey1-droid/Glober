"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildMissionContract } from "@/lib/contract";

export async function generateContract(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const matchId = String(formData.get("match_id") || "").trim();
  if (!matchId) redirect("/dashboard");

  const { data: match } = await supabase
    .from("matches")
    .select("id, mission_id, nomad_id, role")
    .eq("id", matchId)
    .maybeSingle();
  if (!match) redirect("/dashboard");

  // Contrat déjà généré -> on y va directement (idempotent).
  const { data: existing } = await supabase
    .from("contracts")
    .select("id")
    .eq("match_id", matchId)
    .maybeSingle();
  if (existing) redirect(`/contracts/${existing.id}`);

  const [{ data: mission }, { data: nomad }] = await Promise.all([
    supabase
      .from("missions")
      .select("title, brief, vertical, budget_eur, desired_overlap_window, company_id")
      .eq("id", match.mission_id)
      .maybeSingle(),
    supabase
      .from("nomad_profiles")
      .select("headline, city, country")
      .eq("id", match.nomad_id)
      .maybeSingle(),
  ]);
  if (!mission) redirect("/dashboard");

  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", mission.company_id)
    .maybeSingle();

  const reference = `LAT-${Date.now().toString(36).toUpperCase()}`;
  const body = buildMissionContract({
    reference,
    date: new Date().toLocaleDateString("fr-FR"),
    companyName: company?.name ?? "Le Client",
    nomadHeadline: nomad?.headline ?? "Prestataire indépendant",
    nomadLocation: [nomad?.city, nomad?.country].filter(Boolean).join(", ") || "—",
    missionTitle: mission.title ?? "Mission",
    brief: mission.brief ?? "",
    vertical: mission.vertical ?? "",
    budgetEur: mission.budget_eur,
    overlapWindow: mission.desired_overlap_window ?? "",
    role: match.role,
  });

  const { data: created, error } = await supabase
    .from("contracts")
    .insert({
      mission_id: match.mission_id,
      match_id: match.id,
      type: "mission",
      reference,
      body,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/threads/${matchId}?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/contracts/${created.id}`);
}

export async function markSigned(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("contract_id") || "").trim();
  if (!id) redirect("/dashboard");

  const { error } = await supabase
    .from("contracts")
    .update({ signed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(`/contracts/${id}?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/contracts/${id}`);
}
