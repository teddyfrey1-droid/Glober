"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(fd: FormData, k: string): string {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
}

export async function createMission(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!company) redirect("/onboarding/company");

  const budget = parseFloat(str(formData, "budget_eur"));

  const { data: mission, error } = await supabase
    .from("missions")
    .insert({
      company_id: company.id,
      title: str(formData, "title") || null,
      vertical: str(formData, "vertical") || null,
      brief: str(formData, "brief") || null,
      budget_eur: Number.isFinite(budget) ? budget : null,
      desired_overlap_window: str(formData, "desired_overlap_window") || null,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/missions/new?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/missions/${mission.id}`);
}

export async function proposeMatch(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const missionId = str(formData, "mission_id");
  const nomadId = str(formData, "nomad_id");
  const role = str(formData, "role");

  if (!missionId || !nomadId || (role !== "primary" && role !== "backup")) {
    redirect(`/missions/${missionId}?error=${encodeURIComponent("Données invalides.")}`);
  }

  const { error } = await supabase.from("matches").upsert(
    { mission_id: missionId, nomad_id: nomadId, role, status: "proposed" },
    { onConflict: "mission_id,nomad_id" },
  );

  if (error) {
    redirect(`/missions/${missionId}?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/missions/${missionId}`);
}
