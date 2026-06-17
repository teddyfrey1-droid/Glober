import { ImageResponse } from "next/og";

// Image OG générée en code (cf. docs/05). Remplace l'export Figma : halo corail
// propre (radial-gradient) au lieu du cercle terne, et zéro asset binaire à gérer.
export const alt = "Latitude — La liberté, ça se gagne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0E1A2B",
          backgroundImage:
            "radial-gradient(circle at 88% 14%, rgba(255,107,91,0.34), rgba(255,107,91,0) 46%)",
          padding: "72px 80px",
          color: "#F7F4EE",
          fontFamily: "sans-serif",
        }}
      >
        {/* Lockup logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#F7F4EE" strokeWidth="3" />
            <rect x="3" y="25.4" width="50" height="5.2" rx="2.6" fill="#FF6B5B" />
            <rect x="26.8" y="9" width="2.4" height="38" rx="1.2" fill="#F7F4EE" opacity="0.45" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.5 }}>Latitude</div>
        </div>

        {/* Accroche */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 94, fontWeight: 700, lineHeight: 1.03, letterSpacing: -2 }}>
            La liberté,
          </div>
          <div style={{ fontSize: 94, fontWeight: 700, lineHeight: 1.03, letterSpacing: -2 }}>
            ça se gagne.
          </div>
        </div>

        {/* Sous-titre */}
        <div style={{ display: "flex", fontSize: 28, color: "rgba(247,244,238,0.82)" }}>
          Un senior au prix d’un junior. Et il ne tombe jamais en panne.
        </div>
      </div>
    ),
    { ...size },
  );
}
