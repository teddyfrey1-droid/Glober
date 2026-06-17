"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ROLES = new Set(["nomad", "company"]);

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "");

  if (!ROLES.has(role)) {
    redirect(`/signup?error=${encodeURIComponent("Choisis un rôle.")}`);
  }

  const supabase = createClient();
  // Le rôle est passé en métadonnée -> le trigger handle_new_user crée le profil.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Confirmation d'email désactivée -> session immédiate -> onboarding.
  if (data.session) {
    redirect(role === "company" ? "/onboarding/company" : "/onboarding/nomad");
  }
  // Confirmation requise -> on invite à vérifier la boîte mail.
  redirect("/signup?notice=verify");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
