import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { SweepstakeCards } from "./SweepstakeCards";

type Sweepstake = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string;
  prize_value_cents: number | null;
};

const demoSweepstakes = (now: Date) => {
  const nowMs = now.getTime();
  const days = (d: number) => new Date(nowMs + d * 24 * 60 * 60 * 1000).toISOString();
  return [
    {
      title: "Pharaoh's Gold Chest",
      description: "Win a gilded bundle inspired by Cairo nights. Coins accepted, AMOE available.",
      image_url:
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
      prize_value_cents: 25000,
      start_at: now.toISOString(),
      end_at: days(5),
      is_active: true,
    },
    {
      title: "Blue Genie Getaway",
      description: "Travel bundle with a touch of sapphire magic. Daily free entry included.",
      image_url:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      prize_value_cents: 120000,
      start_at: now.toISOString(),
      end_at: days(10),
      is_active: true,
    },
    {
      title: "Lamp of Luck",
      description: "Limited-edition artisan lamp plus bonus merch. Enter with coins or AMOE.",
      image_url:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
      prize_value_cents: 8500,
      start_at: now.toISOString(),
      end_at: days(3),
      is_active: true,
    },
  ];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrize(cents: number | null) {
  if (cents == null) return null;
  return currencyFormatter.format(cents / 100);
}

function truncate(text: string | null, length = 140) {
  if (!text) return "";
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
}

function timeLeft(endAt: string) {
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
}

function progress(startAt: string, endAt: string) {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  const now = Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || start >= end) return 0;
  const pct = (now - start) / (end - start);
  return Math.min(1, Math.max(0, pct));
}

export default async function SweepstakesListPage() {
  const supabase = await getSupabaseServerClient();
  const now = new Date().toISOString();

  let sweepstakes: Sweepstake[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("sweepstakes")
      .select(
        "id, title, description, image_url, start_at, end_at, prize_value_cents",
      )
      .eq("is_active", true)
      .lte("start_at", now)
      .gte("end_at", now)
      .order("end_at", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      // Seed demo sweepstakes if the table is empty (best-effort).
      try {
        const samples = demoSweepstakes(new Date());
        const { data: existing } = await supabase.from("sweepstakes").select("title");
        const existingTitles = new Set((existing ?? []).map((s) => s.title));
        const toInsert = samples.filter((s) => !existingTitles.has(s.title));
        if (toInsert.length > 0) {
          await supabase.from("sweepstakes").insert(toInsert);
        }
        const { data: retry } = await supabase
          .from("sweepstakes")
          .select(
            "id, title, description, image_url, start_at, end_at, prize_value_cents",
          )
          .eq("is_active", true)
          .lte("start_at", now)
          .gte("end_at", now)
          .order("end_at", { ascending: true });
        sweepstakes = retry ?? [];
      } catch (seedErr) {
        loadError =
          seedErr && typeof seedErr === "object" && "message" in seedErr
            ? String((seedErr as { message: string }).message)
            : "Using demo view; unable to seed sweepstakes.";
        sweepstakes = demoSweepstakes(new Date()).map((s, idx) => ({
          ...s,
          id: `demo-${idx}`,
        }));
      }
    } else {
      sweepstakes = data;
    }
  } catch (err) {
    loadError =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to load sweepstakes.";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="hero-grid relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1a34] via-[#0a1224] to-[#0b182e] p-10 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-8 top-6 h-32 w-32 rounded-full bg-[#f7c552]/20 blur-[90px]" />
          <div className="absolute right-4 top-0 h-40 w-40 rounded-full bg-[#2f6fde]/22 blur-[110px]" />
          <div className="absolute bottom-0 left-1/2 h-32 w-80 -translate-x-1/2 rounded-full bg-[#0b1a34]/60 blur-[120px]" />
          <div className="absolute inset-0 grid-dots opacity-40" />
        </div>
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_0.6fr] md:items-center">
          <div className="space-y-3">
            <p className="badge w-fit">Live draws</p>
            <h1 className="text-4xl font-semibold text-white">Active sweepstakes</h1>
            <p className="max-w-2xl text-sm text-white/70">
              Earn or buy Genie Coins, drop paid entries, or claim the daily AMOE. All logic is enforced
              server-side for a trusted demo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth" className="btn-primary text-sm">
                Check my balance
              </Link>
              <Link href="/account" className="pill text-sm">
                View profile & entries
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,111,222,0.2),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(247,197,82,0.25),transparent_40%)] opacity-80" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Demo ledger</p>
                <p className="text-xl font-semibold text-white">Coins + Entries</p>
                <p className="mt-1 text-sm text-white/70">
                  Stripe and rewarded ads are mocked—balances jump instantly.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 text-right ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">AMOE</p>
                <p className="text-lg font-semibold text-white">1 free / day</p>
                <p className="text-xs text-white/60">Per sweepstake</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="card border border-red-400/40 bg-red-500/10 p-6 text-sm text-red-100">
          {loadError}
        </div>
      ) : sweepstakes.length === 0 ? (
        <div className="card border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/70">
          No active sweepstakes right now. Check back soon.
        </div>
      ) : (
        <SweepstakeCards sweepstakes={sweepstakes} />
      )}
    </main>
  );
}

