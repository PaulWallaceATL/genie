import { revalidatePath } from "next/cache";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const ADMIN_EMAILS = ["paul@antimatterai.com"];

function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

async function createSweepstake(formData: FormData) {
  "use server";

  const userWithProfile = await getCurrentUserWithProfile();

  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    throw new Error("Forbidden");
  }

  const title = (formData.get("title") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();
  const image_url = (formData.get("image_url") ?? "").toString().trim() || null;
  const prizeValueRaw = (formData.get("prize_value_cents") ?? "")
    .toString()
    .trim();
  const start_at = (formData.get("start_at") ?? "").toString().trim();
  const end_at = (formData.get("end_at") ?? "").toString().trim();
  const is_active = formData.get("is_active") === "on";

  if (!title || !description || !start_at || !end_at) {
    throw new Error("Missing required fields.");
  }

  const startDate = new Date(start_at);
  const endDate = new Date(end_at);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error("Invalid start or end date.");
  }

  if (startDate > endDate) {
    throw new Error("Start date must be before end date.");
  }

  const prize_value_cents =
    prizeValueRaw === "" ? null : Number.parseInt(prizeValueRaw, 10);

  if (
    prize_value_cents !== null &&
    (Number.isNaN(prize_value_cents) || prize_value_cents < 0)
  ) {
    throw new Error("Invalid prize value.");
  }

  const supabase = await getSupabaseServerClient();

  const { error: insertError } = await supabase.from("sweepstakes").insert({
    title,
    description,
    image_url,
    prize_value_cents,
    start_at: startDate.toISOString(),
    end_at: endDate.toISOString(),
    is_active,
  });

  if (insertError) {
    throw insertError;
  }

  revalidatePath("/admin/sweepstakes");
}

export default async function AdminSweepstakesPage() {
  const userWithProfile = await getCurrentUserWithProfile();
  const supabase = await getSupabaseServerClient();

  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="rounded-lg border border-dashed border-red-200 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-red-700">
            403 – Admin access required.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            You must sign in with an approved admin email.
          </p>
        </div>
      </main>
    );
  }

  const { data: sweepstakes, error } = await supabase
    .from("sweepstakes")
    .select("id, title, is_active, start_at, end_at")
    .order("start_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-zinc-900">
          Admin: Manage Sweepstakes
        </h1>
        <p className="text-sm text-zinc-600">
          Create new sweepstakes and view existing ones.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Create Sweepstake</h2>
        <form action={createSweepstake} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800">Title</label>
            <input
              name="title"
              required
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="Holiday Giveaway"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-zinc-800">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="Describe the sweepstake, rules, and prize."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800">Image URL</label>
            <input
              name="image_url"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800">
              Prize Value (cents)
            </label>
            <input
              name="prize_value_cents"
              type="number"
              min={0}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              placeholder="499"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800">
              Start (datetime-local)
            </label>
            <input
              name="start_at"
              type="datetime-local"
              required
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-800">
              End (datetime-local)
            </label>
            <input
              name="end_at"
              type="datetime-local"
              required
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="is_active" className="text-sm text-zinc-800">
              Active
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              Create Sweepstake
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Existing</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {(sweepstakes ?? []).map((s) => (
                <tr key={s.id}>
                  <td className="px-3 py-2 font-mono text-[11px] text-zinc-500">
                    {s.id}
                  </td>
                  <td className="px-3 py-2">{s.title}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        s.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {new Date(s.start_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(s.end_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {(sweepstakes ?? []).length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-zinc-500" colSpan={5}>
                    No sweepstakes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

