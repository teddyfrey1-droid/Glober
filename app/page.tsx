import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Differentiators } from "@/components/Differentiators";
import { HowItWorks } from "@/components/HowItWorks";
import { TriWin } from "@/components/TriWin";
import { Verticals } from "@/components/Verticals";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Differentiators />
        <HowItWorks />
        <TriWin />
        <Verticals />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
