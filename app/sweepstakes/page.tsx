import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

type Sweepstake = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string;
  prize_value_cents: number | null;
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
    sweepstakes = data ?? [];
  } catch (err) {
    loadError =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to load sweepstakes.";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="hero-grid relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1a34] via-[#0a1224] to-[#0b182e] p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-8 top-6 h-32 w-32 rounded-full bg-[#f7c552]/20 blur-[90px]" />
          <div className="absolute right-4 top-0 h-40 w-40 rounded-full bg-[#2f6fde]/22 blur-[110px]" />
          <div className="absolute bottom-0 left-1/2 h-32 w-80 -translate-x-1/2 rounded-full bg-[#0b1a34]/60 blur-[120px]" />
          <div className="absolute inset-0 grid-dots opacity-40" />
        </div>
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="badge w-fit">Live draws</p>
            <h1 className="text-3xl font-semibold text-white">Active Sweepstakes</h1>
            <p className="text-sm text-white/70">
              Enter with Genie Coins or claim the daily free Alternate Method of Entry (AMOE).
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/auth" className="btn-ghost text-sm">
              Check my balance
            </Link>
            <Link href="/account" className="pill text-sm">
              My entries
            </Link>
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sweepstakes.map((item) => (
            <article
              key={item.id}
              className="card flex flex-col gap-3 border border-white/10 p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-40 w-full rounded-lg object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5 text-sm text-white/60">
                  Image coming soon
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  {item.prize_value_cents != null && (
                    <span className="pill bg-white/10 text-xs font-semibold text-white">
                      {formatPrize(item.prize_value_cents)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/70">{truncate(item.description, 110)}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-white/60">
                  <span>Ends {new Date(item.end_at).toLocaleString()}</span>
                  <Link
                    href={`/sweepstakes/${item.id}`}
                    className="text-white/90 underline underline-offset-4 hover:text-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

