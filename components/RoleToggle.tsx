"use client";

import type { Role } from "@/lib/constants";

export function RoleToggle({
  value,
  onChange,
  variant = "dark",
  className = "",
}: {
  value: Role;
  onChange: (role: Role) => void;
  variant?: "dark" | "light";
  className?: string;
}) {
  const wrap =
    variant === "dark"
      ? "bg-white/10 ring-white/15"
      : "bg-ink/5 ring-ink/10";

  const item = (active: boolean) => {
    if (active) {
      return variant === "dark" ? "bg-sand text-ink shadow-soft" : "bg-ink text-sand shadow-soft";
    }
    return variant === "dark" ? "text-sand/70 hover:text-sand" : "text-ink/60 hover:text-ink";
  };

  return (
    <div
      className={`inline-flex w-full max-w-xs items-center rounded-full p-1 ring-1 ${wrap} ${className}`}
      role="tablist"
      aria-label="Choisir le point de vue"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "company"}
        onClick={() => onChange("company")}
        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${item(value === "company")}`}
      >
        Entreprise
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "nomad"}
        onClick={() => onChange("nomad")}
        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${item(value === "nomad")}`}
      >
        Nomade
      </button>
    </div>
  );
}
