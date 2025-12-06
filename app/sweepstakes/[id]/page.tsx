import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { enterWithCoin, freeEntry } from "./actions";

type Sweepstake = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string;
  prize_value_cents: number | null;
  is_active: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrize(cents: number | null) {
  if (cents == null) return null;
  return currencyFormatter.format(cents / 100);
}

export default async function SweepstakesDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await getSupabaseServerClient();
  const now = new Date().toISOString();

  let sweepstake: Sweepstake | null = null;
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("sweepstakes")
      .select(
        "id, title, description, image_url, start_at, end_at, prize_value_cents, is_active",
      )
      .eq("id", params.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    sweepstake = (data as Sweepstake) ?? null;
  } catch (err) {
    loadError =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to load this sweepstake.";
  }

  if (loadError || !sweepstake) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="rounded-lg border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-700">
          {loadError ?? "Sweepstake not found."}
        </div>
      </main>
    );
  }

  const isActive =
    sweepstake.is_active &&
    sweepstake.start_at <= now &&
    sweepstake.end_at >= now;

  const userWithProfile = await getCurrentUserWithProfile();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Sweepstake
        </p>
        <h1 className="text-3xl font-bold text-zinc-900">{sweepstake.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
          <span>
            Starts: {new Date(sweepstake.start_at).toLocaleString(undefined)}
          </span>
          <span>•</span>
          <span>Ends: {new Date(sweepstake.end_at).toLocaleString()}</span>
          {sweepstake.prize_value_cents != null && (
            <>
              <span>•</span>
              <span className="font-semibold text-indigo-700">
                Prize: {formatPrize(sweepstake.prize_value_cents)}
              </span>
            </>
          )}
        </div>
        {sweepstake.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sweepstake.image_url}
            alt={sweepstake.title}
            className="h-64 w-full rounded-lg object-cover"
          />
        ) : null}
        <p className="text-base text-zinc-700">{sweepstake.description}</p>
      </div>

      {!isActive ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600">
          This sweepstake is not currently active.
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Enter this sweepstake
              </p>
              <p className="text-xs text-zinc-600">
                One paid entry costs 1 Genie Coin. One free entry per day (AMOE).
              </p>
            </div>
            {userWithProfile ? (
              <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                Balance: {userWithProfile.profile.coin_balance ?? 0} coins
              </div>
            ) : (
              <div className="text-xs text-red-600">
                Sign in to enter this sweepstake.
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <form action={enterWithCoin}>
              <input type="hidden" name="sweepstakeId" value={sweepstake.id} />
              <button
                type="submit"
                disabled={!userWithProfile || !isActive}
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-200"
              >
                Enter with 1 Genie Coin
              </button>
            </form>
            <form action={freeEntry}>
              <input type="hidden" name="sweepstakeId" value={sweepstake.id} />
              <button
                type="submit"
                disabled={!userWithProfile || !isActive}
                className="rounded-full border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
              >
                Free Entry (1 per day)
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

