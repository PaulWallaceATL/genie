import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { HowItWorks } from "./components/HowItWorks";
import { LandingHero } from "./components/LandingHero";
import { SweepstakeCards } from "./sweepstakes/SweepstakeCards";

type Sweepstake = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string;
  prize_value_cents: number | null;
};

function demoSweepstakes(now: Date): Sweepstake[] {
  const nowMs = now.getTime();
  const days = (d: number) => new Date(nowMs + d * 24 * 60 * 60 * 1000).toISOString();
  return [
    {
      id: "demo-1",
      title: "Pharaoh's Gold Chest",
      description: "Win a gilded bundle inspired by Cairo nights. Coins accepted, AMOE available.",
      image_url:
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      prize_value_cents: 25000,
      start_at: now.toISOString(),
      end_at: days(5),
    },
    {
      id: "demo-2",
      title: "Blue Genie Getaway",
      description: "Travel bundle with a touch of sapphire magic. Daily free entry included.",
      image_url:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      prize_value_cents: 120000,
      start_at: now.toISOString(),
      end_at: days(10),
    },
    {
      id: "demo-3",
      title: "Lamp of Luck",
      description: "Limited-edition artisan lamp plus bonus merch. Enter with coins or AMOE.",
      image_url:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
      prize_value_cents: 8500,
      start_at: now.toISOString(),
      end_at: days(3),
    },
  ];
}

async function loadFeaturedSweepstakes(): Promise<{ sweepstakes: Sweepstake[]; error?: string | null }> {
  const supabase = await getSupabaseServerClient();
  const now = new Date().toISOString();
  try {
    const { data, error } = await supabase
      .from("sweepstakes")
      .select("id, title, description, image_url, start_at, end_at, prize_value_cents")
      .eq("is_active", true)
      .lte("start_at", now)
      .gte("end_at", now)
      .order("end_at", { ascending: true })
      .limit(6);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { sweepstakes: demoSweepstakes(new Date()), error: "Showing demo raffles" };
    }
    return { sweepstakes: data, error: null };
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to load sweepstakes";
    return { sweepstakes: demoSweepstakes(new Date()), error: message };
  }
}

export default async function Home() {
  const { sweepstakes, error: featuredError } = await loadFeaturedSweepstakes();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <div className="sticky top-[76px] z-10 mb-2">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/10 via-transparent to-white/10 blur-3xl" />
      </div>
      <LandingHero />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="badge">Live raffles</p>
            <h2 className="text-2xl font-semibold text-white">Featured sweepstakes</h2>
            <p className="text-sm text-white/70">Tap a card to view details, enter with coins, or claim AMOE.</p>
          </div>
          <Link href="/sweepstakes" className="btn-ghost text-sm">
            View all
          </Link>
        </div>
        {featuredError && (
          <p className="text-xs text-white/50">{featuredError}</p>
        )}
        <SweepstakeCards sweepstakes={sweepstakes} />
      </section>

      <HowItWorks />
    </main>
  );
}

