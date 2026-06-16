import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Latitude (cf. docs/05)
        ink: "#0E1A2B", // Encre nuit
        coral: "#FF6B5B", // Corail
        amber: "#F5A623", // Ambre
        sand: "#F7F4EE", // Sable
        jade: "#1FAE8B", // Jade
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px -20px rgba(14, 26, 43, 0.25)",
        soft: "0 8px 30px -12px rgba(14, 26, 43, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
