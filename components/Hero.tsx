"use client";

import { useState } from "react";
import { HERO_COPY, type Role } from "@/lib/constants";
import { ProfileCard } from "./ProfileCard";
import { RoleToggle } from "./RoleToggle";

export function Hero() {
  const [role, setRole] = useState<Role>("company");
  const copy = HERO_COPY[role];

  return (
    <section id="top" className="relative overflow-hidden bg-ink text-sand">
      {/* Motif de marque + halo */}
      <div className="absolute inset-0 bg-map-lines opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-coral/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-jade/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <RoleToggle value={role} onChange={setRole} />

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] md:text-5xl">
            {copy.title}
            <br />
            <span className="text-amber">{copy.highlight}</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-sand/80">{copy.sub}</p>

          <ul className="mt-6 space-y-2">
            {copy.points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-sand/90">
                <span className="text-jade" aria-hidden="true">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
            >
              {copy.cta}
            </a>
            <a
              href="#how"
              className="rounded-full px-5 py-3 font-medium text-sand/80 ring-1 ring-white/20 transition hover:text-sand"
            >
              Comment ça marche
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div key={role} className="animate-fade-up">
            <ProfileCard />
          </div>
        </div>
      </div>
    </section>
  );
}
