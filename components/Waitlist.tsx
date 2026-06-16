"use client";

import { useState } from "react";
import {
  COMPANY_COUNTRIES,
  NOMAD_COUNTRIES,
  VERTICALS,
  type Role,
} from "@/lib/constants";
import { RoleToggle } from "./RoleToggle";

type Status = "idle" | "loading" | "success" | "error";

export function Waitlist() {
  const [role, setRole] = useState<Role>("company");
  const [email, setEmail] = useState("");
  const [vertical, setVertical] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const countries = role === "company" ? COMPANY_COUNTRIES : NOMAD_COUNTRIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, vertical, country }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(
          data.already
            ? "Tu es déjà sur la liste — on te tient au courant. 🌍"
            : "C’est noté ! On revient vers toi très vite. 🌍",
        );
        setEmail("");
        setVertical("");
        setCountry("");
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue. Réessaie.");
      }
    } catch {
      setStatus("error");
      setMessage("Connexion impossible. Réessaie dans un instant.");
    }
  }

  const metierLabel = role === "company" ? "Métier recherché" : "Ton métier";
  const countryLabel = role === "company" ? "Pays de l’entreprise" : "Ton hub / pays";

  return (
    <section id="waitlist" className="relative overflow-hidden bg-ink py-20 text-sand">
      <div className="absolute inset-0 bg-map-lines opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-coral/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">
            Rejoins la première vague
          </h2>
          <p className="mt-4 max-w-md text-sand/80">
            On lance en cercle fermé sur une poignée de hubs et de verticales. Laisse
            ton email pour être prévenu·e en priorité — côté entreprise comme côté
            nomade.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-sand/75">
            <li className="flex items-center gap-2">
              <span className="text-jade">✓</span> Accès anticipé à la sélection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-jade">✓</span> Conditions de lancement préférentielles
            </li>
            <li className="flex items-center gap-2">
              <span className="text-jade">✓</span> Zéro spam — juste l’essentiel
            </li>
          </ul>
        </div>

        <div className="rounded-4xl bg-white p-6 text-ink shadow-card md:p-8">
          <RoleToggle value={role} onChange={setRole} variant="light" />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-ink/30 focus:border-coral focus:ring-2 focus:ring-coral/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="vertical" className="mb-1 block text-sm font-medium text-ink/70">
                  {metierLabel}
                </label>
                <select
                  id="vertical"
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
                >
                  <option value="">Sélectionne…</option>
                  {VERTICALS.map((v) => (
                    <option key={v.id} value={v.label}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="country" className="mb-1 block text-sm font-medium text-ink/70">
                  {countryLabel}
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
                >
                  <option value="">Sélectionne…</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading"
                ? "Envoi…"
                : role === "company"
                  ? "Rejoindre la waitlist"
                  : "Postuler à la waitlist"}
            </button>

            {status === "success" && (
              <p className="rounded-xl bg-jade/10 px-4 py-3 text-sm font-medium text-ink ring-1 ring-jade/30">
                {message}
              </p>
            )}
            {status === "error" && (
              <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-ink ring-1 ring-coral/30">
                {message}
              </p>
            )}

            <p className="text-center text-xs text-ink/40">
              En t’inscrivant, tu acceptes d’être recontacté·e par Latitude. Aucune
              donnée revendue.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
