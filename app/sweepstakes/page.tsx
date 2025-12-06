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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900">Active Sweepstakes</h1>
        <p className="text-sm text-zinc-600">
          Enter with Genie Coins or use the free daily entry for each sweepstake
          (AMOE).
        </p>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {loadError}
        </div>
      ) : sweepstakes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
          No active sweepstakes right now. Check back soon!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sweepstakes.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-lg bg-zinc-100 text-sm text-zinc-500">
                  No image
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {item.title}
                  </h2>
                  {item.prize_value_cents != null && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {formatPrize(item.prize_value_cents)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-600">
                  {truncate(item.description, 110)}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-zinc-500">
                  <span>Ends {new Date(item.end_at).toLocaleString()}</span>
                  <Link
                    href={`/sweepstakes/${item.id}`}
                    className="text-indigo-600 hover:text-indigo-700"
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

