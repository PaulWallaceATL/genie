import { HowItWorks } from "./components/HowItWorks";
import { LandingHero } from "./components/LandingHero";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <div className="sticky top-[76px] z-10 mb-2">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/10 via-transparent to-white/10 blur-3xl" />
      </div>
      <LandingHero />
      <HowItWorks />
    </main>
  );
}

