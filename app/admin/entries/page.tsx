import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { SectionHeader } from "../components/ui/SectionHeader";

const ADMIN_EMAILS = ["paul@antimatterai.com"];

function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

type EntryWithRelations = {
  id: string;
  entry_type: "paid" | "earned" | "free";
  created_at: string;
  sweepstake_id: string;
  user_id: string;
  profiles: { email: string | null } | null;
  sweepstakes: { title: string | null } | null;
};

export default async function AdminEntriesPage() {
  const userWithProfile = await getCurrentUserWithProfile();

  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="card border border-red-400/40 bg-red-500/10 p-8 text-center">
          <p className="text-sm font-semibold text-red-100">403 – Admin access required.</p>
          <p className="mt-2 text-sm text-white/70">
            You must sign in with an approved admin email to view entries.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await getSupabaseServerClient();

  const { data: entries, error } = await supabase
    .from("entries")
    .select(
      "id, entry_type, created_at, sweepstake_id, user_id, profiles:profiles(email), sweepstakes(title)",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<EntryWithRelations[]>();

  if (error) {
    throw error;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b1a34] via-[#0a1224] to-[#0b1a34] p-8">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-[#2f6fde]/25 blur-[120px]" />
          <div className="absolute right-0 top-10 h-40 w-40 rounded-full bg-[#f7c552]/20 blur-[110px]" />
        </div>
        <div className="relative flex flex-col gap-3">
          <p className="badge w-fit">Admin</p>
          <h1 className="text-3xl font-semibold text-white">Entries tracker</h1>
          <p className="text-sm text-white/70">
            All entries across users and sweepstakes. Most recent first (latest 200).
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin/sweepstakes" className="btn-ghost text-sm">
              Manage sweepstakes
            </Link>
            <Link href="/sweepstakes" className="pill text-sm">
              View live page
            </Link>
          </div>
        </div>
      </div>

      <section className="card border border-white/10 bg-white/5 p-6 shadow-xl">
        <SectionHeader
          eyebrow="Entries"
          title="Latest 200 entries"
          description="Track paid, earned, and free entries. Add filters when wiring search."
          actions={
            <div className="flex flex-wrap gap-2">
              <input
                placeholder="Search by user/email..."
                className="w-56 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50"
              />
              <select className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">
                <option value="">All types</option>
                <option value="paid">Paid</option>
                <option value="earned">Earned</option>
                <option value="free">Free</option>
              </select>
            </div>
          }
        />
        {entries && entries.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/5">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/60">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Sweepstake</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">IDs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {entries.map((entry) => (
                  <tr key={entry.id} className="transition hover:bg-white/5">
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span>{entry.profiles?.email ?? "Unknown"}</span>
                        <span className="text-[11px] text-white/50">user: {entry.user_id}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span>{entry.sweepstakes?.title ?? "Unknown"}</span>
                        <Link
                          href={`/sweepstakes/${entry.sweepstake_id}`}
                          className="text-[11px] text-white/60 underline"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="pill text-xs uppercase tracking-wide">{entry.entry_type}</span>
                    </td>
                    <td className="px-3 py-2">
                      {new Date(entry.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-white/60">
                      entry: {entry.id}
                      <br />
                      sweepstake: {entry.sweepstake_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-white/70">No entries found yet.</p>
        )}
      </section>
    </main>
  );
}

