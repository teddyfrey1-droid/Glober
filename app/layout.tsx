import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://latitude.example"),
  title: "Latitude — La liberté, ça se gagne",
  description:
    "La marketplace qui connecte des talents nomades diplômés avec des entreprises francophones. Un senior au prix d’un junior, une continuité de service garantie.",
  keywords: [
    "nomades",
    "freelance",
    "remote",
    "talents",
    "marketplace",
    "B2B",
    "francophone",
  ],
  openGraph: {
    title: "Latitude — La liberté, ça se gagne",
    description:
      "Un senior au prix d’un junior, une continuité de service garantie. La marketplace des talents nomades pour entreprises francophones.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
