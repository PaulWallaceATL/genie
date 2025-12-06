import Link from "next/link";
import { ProfileHero } from "./ProfileHero";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

type EntryRow = {
  id: string;
  entry_type: "paid" | "earned" | "free";
  created_at: string;
  sweepstake_id: string;
  sweepstakes: { id: string; title: string; prize_value_cents: number | null } | null;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatPrize(cents: number | null) {
  if (cents == null) return "—";
  return currencyFormatter.format(cents / 100);
}

export default async function AccountPage() {
  const userWithProfile = await getCurrentUserWithProfile();

  if (!userWithProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1a34] via-[#0b1324] to-[#0b1a34] p-8 shadow-2xl">
          <p className="badge">Account</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Sign in to track your magic</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Access your Genie Coin balance, instant demo purchases, rewarded ad boosts, and entry
            history.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/auth" className="btn-primary text-sm">
              Go to sign in
            </Link>
            <Link href="/sweepstakes" className="btn-ghost text-sm">
              Browse sweepstakes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();

  const { data: entries } = await supabase
    .from("entries")
    .select(
      "id, entry_type, created_at, sweepstake_id, sweepstakes(id, title, prize_value_cents)",
    )
    .eq("user_id", userWithProfile.user.id)
    .order("created_at", { ascending: false })
    .returns<EntryRow[]>();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-14">
      <ProfileHero email={userWithProfile.user.email} balance={userWithProfile.profile.coin_balance ?? 0} />

      <section className="card border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent entries</h2>
            <p className="text-sm text-white/60">Your latest sweepstakes activity.</p>
          </div>
          <Link href="/sweepstakes" className="btn-ghost text-sm">
            Enter more
          </Link>
        </div>

        {entries && entries.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.slice(0, 6).map((entry) => (
              <article
                key={entry.id}
                className="card flex flex-col gap-2 border border-white/10 bg-white/5 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span className="pill bg-white/5 text-[11px] uppercase tracking-[0.2em]">
                    {entry.entry_type}
                  </span>
                  <span>
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {entry.sweepstakes?.title ?? "Unknown sweepstake"}
                  </p>
                  <p className="text-xs text-white/60">
                    Prize {formatPrize(entry.sweepstakes?.prize_value_cents ?? null)}
                  </p>
                </div>
                <Link
                  href={`/sweepstakes/${entry.sweepstake_id}`}
                  className="text-xs text-white/80 underline underline-offset-4"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-white/70">
            You have not entered any sweepstakes yet. Visit the sweepstakes page to enter your first
            one.
          </p>
        )}
      </section>
    </main>
  );
}

