import Link from "next/link";
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
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="card border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">You need to sign in to view your account.</p>
          <div className="mt-3">
            <Link href="/auth" className="btn-primary text-sm">
              Go to sign in
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
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="badge">My account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
          <span className="pill">{userWithProfile.user.email}</span>
          <span className="pill">Balance: {userWithProfile.profile.coin_balance ?? 0} coins</span>
        </div>
      </div>

      <section className="card border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">My entries</h2>
            <p className="text-sm text-white/60">All sweepstakes you have entered.</p>
          </div>
          <Link href="/sweepstakes" className="btn-ghost text-sm">
            Enter more
          </Link>
        </div>

        {entries && entries.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-white/50">
                <tr>
                  <th className="px-3 py-2">Sweepstake</th>
                  <th className="px-3 py-2">Prize</th>
                  <th className="px-3 py-2">Entry type</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span>{entry.sweepstakes?.title ?? "Unknown"}</span>
                        <Link
                          href={`/sweepstakes/${entry.sweepstake_id}`}
                          className="text-xs text-white/60 underline"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 py-2">{formatPrize(entry.sweepstakes?.prize_value_cents ?? null)}</td>
                    <td className="px-3 py-2">
                      <span className="pill text-xs uppercase tracking-wide">
                        {entry.entry_type}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {new Date(entry.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

