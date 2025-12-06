import Link from "next/link";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EntryActions } from "./EntryActions";

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

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function progress(start: string, end: string) {
  const startAt = new Date(start).getTime();
  const endAt = new Date(end).getTime();
  const now = Date.now();
  if (Number.isNaN(startAt) || Number.isNaN(endAt) || startAt >= endAt) return 0;
  const ratio = (now - startAt) / (endAt - startAt);
  return Math.min(1, Math.max(0, ratio));
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
  let entriesCount = 0;
  let hasFreeToday = false;

  if (userWithProfile) {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userWithProfile.user.id)
      .eq("sweepstake_id", sweepstake.id);

    entriesCount = count ?? 0;

    const { data: freeEntryRow } = await supabase
      .from("entries")
      .select("id")
      .eq("user_id", userWithProfile.user.id)
      .eq("sweepstake_id", sweepstake.id)
      .eq("entry_type", "free")
      .gte("created_at", startOfToday.toISOString())
      .maybeSingle();

    hasFreeToday = Boolean(freeEntryRow);
  }

  const timelineProgress = progress(sweepstake.start_at, sweepstake.end_at);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#070d1a]/70 via-[#050911]/60 to-[#050911]" />
          <div className="absolute inset-0 grid-dots opacity-30" />
          <div className="absolute left-6 top-6 h-28 w-28 rounded-full bg-[#f7c552]/18 blur-[110px]" />
          <div className="absolute right-4 top-0 h-36 w-36 rounded-full bg-[#2f6fde]/20 blur-[120px]" />
        </div>

        <div className="relative overflow-hidden rounded-t-3xl">
          {sweepstake.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sweepstake.image_url}
              alt={sweepstake.title}
              className="h-72 w-full object-cover"
            />
          ) : (
            <div className="h-72 w-full bg-gradient-to-r from-[#0b1a34] via-[#0a1224] to-[#0b182e]" />
          )}
          {sweepstake.prize_value_cents != null && (
            <span className="absolute left-6 top-6 rounded-full border border-white/25 bg-gradient-to-r from-[#2f6fde] via-[#4fa3ff] to-[#f7c552] px-4 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur">
              {formatPrize(sweepstake.prize_value_cents)}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050911] via-transparent to-transparent" />
        </div>

        <div className="relative flex flex-col gap-5 p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="badge">Sweepstake</p>
              <h1 className="text-4xl font-semibold text-white">{sweepstake.title}</h1>
              <p className="max-w-3xl text-base text-white/80">{sweepstake.description}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-right shadow-lg">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Countdown</p>
              <div className="mt-1 text-sm text-white">
                <CountdownTimer endAt={sweepstake.end_at} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="pill bg-white/10">Starts: {formatDate(sweepstake.start_at)}</span>
            <span className="pill bg-white/10">Ends: {formatDate(sweepstake.end_at)}</span>
            <span className="pill bg-white/10">
              Progress: {(timelineProgress * 100).toFixed(0)}%
            </span>
            <span className="pill bg-white/10">Your entries: {entriesCount}</span>
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Entry window</span>
              <CountdownTimer endAt={sweepstake.end_at} />
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2f6fde] via-[#4fa3ff] to-[#f7c552]"
                style={{ width: `${Math.max(8, timelineProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Status</p>
          <p className="mt-2 text-lg font-semibold text-white">{isActive ? "Active" : "Inactive"}</p>
          <p className="text-sm text-white/60">
            {isActive ? "Accepting entries now." : "This sweepstake is closed."}
          </p>
        </div>
        <div className="card border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Your entries</p>
          <p className="mt-2 text-lg font-semibold text-white">{entriesCount}</p>
          <p className="text-sm text-white/60">Paid, earned, and free combined.</p>
        </div>
        <div className="card border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Free entry today</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {hasFreeToday ? "Already claimed" : "Available"}
          </p>
          <p className="text-sm text-white/60">
            One AMOE entry every 24h per sweepstake.
          </p>
        </div>
      </div>

      {!isActive ? (
        <div className="card border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/70">
          This sweepstake is not currently active.
        </div>
      ) : userWithProfile ? (
        <EntryActions
          sweepstakeId={sweepstake.id}
          isActive={isActive}
          hasFreeToday={hasFreeToday}
          balance={userWithProfile.profile.coin_balance}
          entriesCount={entriesCount}
        />
      ) : (
        <div className="card flex flex-col gap-3 border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          <p>Sign in to enter this sweepstake.</p>
          <Link href="/auth" className="btn-primary text-sm w-fit">
            Sign in
          </Link>
        </div>
      )}
    </main>
  );
}

