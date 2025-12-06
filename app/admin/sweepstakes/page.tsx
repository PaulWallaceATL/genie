import { revalidatePath } from "next/cache";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { SweepstakeAdminTable } from "./SweepstakeAdminTable";

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
    {
      title: "Sands of Fortune",
      description: "Desert experience pack with premium gear and a private guide.",
      image_url:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 68000,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      title: "Oasis Spa Retreat",
      description: "Two-night spa stay with gold-infused treatments and blue oasis pools.",
      image_url:
        "https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 42000,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      title: "Midnight Bazaar Bundle",
      description: "Handmade crafts, spices, and textiles curated from local bazaars.",
      image_url:
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 12500,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    },
    {
      title: "Sapphire Tech Drop",
      description: "Latest gadgets in sapphire blue, plus bonus coins for next entries.",
      image_url:
        "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
      prize_value_cents: 54000,
      start_at: new Date(now).toISOString(),
      end_at: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
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

type ActionState = { status: "idle" | "success" | "error"; message?: string };

async function closeSweepstake(formData: FormData): Promise<ActionState> {
  "use server";

  const sweepstakeId = formData.get("sweepstakeId");
  if (typeof sweepstakeId !== "string" || !sweepstakeId) {
    return { status: "error", message: "Invalid sweepstake id." };
  }

  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    return { status: "error", message: "Forbidden" };
  }

  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from("sweepstakes").update({ is_active: false }).eq("id", sweepstakeId);
  if (error) {
    return { status: "error", message: error.message ?? "Unable to close sweepstake" };
  }

  revalidatePath("/admin/sweepstakes");
  revalidatePath("/sweepstakes");
  return { status: "success", message: "Sweepstake closed." };
}

async function selectWinner(formData: FormData): Promise<ActionState> {
  "use server";

  const sweepstakeId = formData.get("sweepstakeId");
  if (typeof sweepstakeId !== "string" || !sweepstakeId) {
    return { status: "error", message: "Invalid sweepstake id." };
  }

  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile || !isAdmin(userWithProfile.user.email)) {
    return { status: "error", message: "Forbidden" };
  }

  const supabase = await getSupabaseServerClient();

  const { data: entries, error } = await supabase
    .from("entries")
    .select("id, user_id, profiles:profiles(email)")
    .eq("sweepstake_id", sweepstakeId);

  if (error) {
    return { status: "error", message: error.message ?? "Failed to load entries." };
  }

  if (!entries || entries.length === 0) {
    return { status: "error", message: "No entries to select from." };
  }

  const random = entries[Math.floor(Math.random() * entries.length)];
  const winnerEmail = random.profiles?.email ?? "Unknown";

  // Attempt to persist winner metadata if columns exist; otherwise just deactivate.
  const candidateUpdate: Record<string, unknown> = {
    is_active: false,
    winner_entry_id: random.id,
    winner_user_id: random.user_id,
    winner_selected_at: new Date().toISOString(),
  };

  let updateFailed = false;
  const { error: updateError } = await supabase
    .from("sweepstakes")
    .update(candidateUpdate)
    .eq("id", sweepstakeId);

  if (updateError) {
    // Fallback to minimal update if the schema lacks the winner columns.
    if (updateError.code === "42703") {
      updateFailed = true;
    } else {
      return { status: "error", message: updateError.message ?? "Unable to update sweepstake." };
    }
  }

  if (updateFailed) {
    const { error: minimalError } = await supabase
      .from("sweepstakes")
      .update({ is_active: false })
      .eq("id", sweepstakeId);
    if (minimalError) {
      return { status: "error", message: minimalError.message ?? "Unable to close sweepstake." };
    }
  }

  revalidatePath("/admin/sweepstakes");
  revalidatePath("/admin/entries");
  revalidatePath("/sweepstakes");

  return { status: "success", message: `Winner: ${winnerEmail}` };
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
    .select("id, title, is_active, start_at, end_at, winner_user_id")
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
        <SweepstakeAdminTable
          sweepstakes={sweepstakes ?? []}
          onPickWinner={selectWinner}
          onClose={closeSweepstake}
        />
      </section>
    </main>
  );
}

