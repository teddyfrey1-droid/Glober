"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function numOrNull(fd: FormData, key: string): number | null {
  const n = parseFloat(str(fd, key));
  return Number.isFinite(n) ? n : null;
}
function langs(fd: FormData): string[] {
  return str(fd, "languages")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveNomadOnboarding(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: np, error } = await supabase
    .from("nomad_profiles")
    .upsert(
      {
        user_id: user.id,
        headline: str(formData, "headline") || null,
        vertical: str(formData, "vertical") || null,
        bio: str(formData, "bio") || null,
        city: str(formData, "city") || null,
        country: str(formData, "country") || null,
        timezone: str(formData, "timezone") || null,
        seniority: str(formData, "seniority") || null,
        day_rate_eur: numOrNull(formData, "day_rate_eur"),
        languages: langs(formData),
        status: "pending_review",
      },
      { onConflict: "user_id" },
    )
    .select("id")
    .single();

  if (error) {
    redirect(`/onboarding/nomad?error=${encodeURIComponent(error.message)}`);
  }

  // Fenêtre de chevauchement NÉGOCIÉE (jamais un horaire imposé, cf. docs/03).
  const overlap = str(formData, "overlap_window");
  if (overlap) {
    await supabase
      .from("availability")
      .insert({ nomad_id: np.id, overlap_window: overlap });
  }

  redirect("/dashboard");
}

export async function saveCompanyOnboarding(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("companies").upsert(
    {
      user_id: user.id,
      name: str(formData, "name") || null,
      country: str(formData, "country") || null,
      size: str(formData, "size") || null,
      plan: str(formData, "plan") || "studio",
    },
    { onConflict: "user_id" },
  );

  if (error) {
    redirect(`/onboarding/company?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}
