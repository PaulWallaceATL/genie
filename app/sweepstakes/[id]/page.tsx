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
        <div className="card border border-red-400/40 bg-red-500/10 p-8 text-center text-red-100">
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
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <p className="badge">Sweepstake</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{sweepstake.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/60">
          <span>Starts: {new Date(sweepstake.start_at).toLocaleString(undefined)}</span>
          <span>•</span>
          <span>Ends: {new Date(sweepstake.end_at).toLocaleString()}</span>
          {sweepstake.prize_value_cents != null && (
            <>
              <span>•</span>
              <span className="text-white">{formatPrize(sweepstake.prize_value_cents)}</span>
            </>
          )}
        </div>
        {sweepstake.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sweepstake.image_url}
            alt={sweepstake.title}
            className="mt-4 h-64 w-full rounded-xl object-cover ring-1 ring-white/10"
          />
        ) : null}
        <p className="mt-3 text-base text-white/75">{sweepstake.description}</p>
      </div>

      {!isActive ? (
        <div className="card border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/70">
          This sweepstake is not currently active.
        </div>
      ) : (
        <div className="card flex flex-col gap-4 border border-white/10 bg-white/5 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-white">Enter this sweepstake</p>
              <p className="text-xs text-white/70">
                One paid entry costs 1 Genie Coin. One free entry per day (AMOE).
              </p>
            </div>
            {userWithProfile ? (
              <div className="pill text-xs font-semibold text-white">
                Balance: {userWithProfile.profile.coin_balance ?? 0} coins
              </div>
            ) : (
              <div className="text-xs text-[#ffb4c4]">Sign in to enter this sweepstake.</div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <form action={enterWithCoin}>
              <input type="hidden" name="sweepstakeId" value={sweepstake.id} />
              <button
                type="submit"
                disabled={!userWithProfile || !isActive}
                className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enter with 1 Genie Coin
              </button>
            </form>
            <form action={freeEntry}>
              <input type="hidden" name="sweepstakeId" value={sweepstake.id} />
              <button
                type="submit"
                disabled={!userWithProfile || !isActive}
                className="btn-ghost text-sm disabled:cursor-not-allowed disabled:opacity-50"
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

