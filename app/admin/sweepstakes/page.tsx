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

async function seedSampleSweepstakes() {
  "use server";

  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    throw new Error("Forbidden");
  }

  const supabase = await getSupabaseServerClient();
  const now = new Date();

  const samples = [
    {
      title: "Pharaoh's Gold Chest",
      description: "Win a gilded bundle inspired by Cairo nights. Coins accepted, AMOE available.",
      image_url:
        "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 25000,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      title: "Blue Genie Getaway",
      description: "Travel bundle with a touch of sapphire magic. Daily free entry included.",
      image_url:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 120000,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      title: "Lamp of Luck",
      description: "Limited-edition artisan lamp plus bonus merch. Enter with coins or AMOE.",
      image_url:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 8500,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
  ];

  // Avoid duplicating by title.
  const { data: existing } = await supabase.from("sweepstakes").select("title");
  const existingTitles = new Set((existing ?? []).map((s) => s.title));
  const toInsert = samples.filter((s) => !existingTitles.has(s.title));

  if (toInsert.length === 0) {
    return;
  }

  const { error } = await supabase.from("sweepstakes").insert(toInsert);
  if (error) {
    throw error;
  }

  revalidatePath("/admin/sweepstakes");
  revalidatePath("/sweepstakes");
}

export default async function AdminSweepstakesPage() {
  const userWithProfile = await getCurrentUserWithProfile();
  const supabase = await getSupabaseServerClient();

  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="card border border-red-400/40 bg-red-500/10 p-8 text-center">
          <p className="text-sm font-semibold text-red-100">
            403 – Admin access required.
          </p>
          <p className="mt-2 text-sm text-white/70">
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
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="badge w-fit">Admin</p>
        <h1 className="text-3xl font-semibold text-white">Manage Sweepstakes</h1>
        <p className="text-sm text-white/70">Create new sweepstakes and view existing ones.</p>
      </div>

      <section className="card border border-white/10 bg-white/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Create Sweepstake</h2>
        <form action={seedSampleSweepstakes} className="mt-2">
          <button type="submit" className="btn-ghost text-xs px-3 py-2">
            Generate sample raffles
          </button>
        </form>
        <form action={createSweepstake} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Title</label>
            <input
              name="title"
              required
              className="text-sm"
              placeholder="Holiday Giveaway"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              className="text-sm"
              placeholder="Describe the sweepstake, rules, and prize."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Image URL</label>
            <input
              name="image_url"
              className="text-sm"
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">
              Prize Value (cents)
            </label>
            <input
              name="prize_value_cents"
              type="number"
              min={0}
              className="text-sm"
              placeholder="499"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">
              Start (datetime-local)
            </label>
            <input
              name="start_at"
              type="datetime-local"
              required
              className="text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">
              End (datetime-local)
            </label>
            <input
              name="end_at"
              type="datetime-local"
              required
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              className="h-4 w-4 rounded border-white/40 text-[#a78bfa] focus:ring-indigo-500"
            />
            <label htmlFor="is_active" className="text-sm text-white/80">
              Active
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="btn-primary text-sm"
            >
              Create Sweepstake
            </button>
          </div>
        </form>
      </section>

      <section className="card border border-white/10 bg-white/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Existing</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-white/50">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {(sweepstakes ?? []).map((s) => (
                <tr key={s.id}>
                  <td className="px-3 py-2 font-mono text-[11px] text-white/50">
                    {s.id}
                  </td>
                  <td className="px-3 py-2">{s.title}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        s.is_active
                          ? "bg-green-500/15 text-green-100"
                          : "bg-white/5 text-white/60"
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
                  <td className="px-3 py-4 text-sm text-white/60" colSpan={5}>
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

