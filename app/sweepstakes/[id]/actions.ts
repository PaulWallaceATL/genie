'use server';

import { revalidatePath } from "next/cache";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type ActionState = { status: "idle" | "success" | "error"; message?: string };

const success = (message: string): ActionState => ({ status: "success", message });
const failure = (message: string): ActionState => ({ status: "error", message });

async function getActiveSweepstake(id: string) {
  const supabase = await getSupabaseServerClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("sweepstakes")
    .select(
      "id, title, description, image_url, start_at, end_at, prize_value_cents",
    )
    .eq("id", id)
    .eq("is_active", true)
    .lte("start_at", now)
    .gte("end_at", now)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (!data) {
    throw new Error("Sweepstake is not available or has ended.");
  }

  return { supabase, sweepstake: data as Sweepstake };
}

export async function enterWithCoin(prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const sweepstakeId = formData.get("sweepstakeId");
    if (typeof sweepstakeId !== "string" || !sweepstakeId) {
      return failure("Invalid sweepstake id.");
    }

    const userWithProfile = await getCurrentUserWithProfile();
    if (!userWithProfile) {
      return failure("You must be signed in to enter.");
    }

    const { user, profile } = userWithProfile;
    const { supabase, sweepstake } = await getActiveSweepstake(sweepstakeId);

    const currentBalance = profile.coin_balance ?? 0;
    if (currentBalance < 1) {
      return failure("Not enough Genie Coins for a paid entry.");
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coin_balance: currentBalance - 1 })
      .eq("id", profile.id);

    if (updateError) {
      return failure(updateError.message ?? "Unable to deduct coin.");
    }

    const { error: insertError } = await supabase.from("entries").insert({
      sweepstake_id: sweepstake.id,
      user_id: user.id,
      entry_type: "paid",
    });

    if (insertError) {
      return failure(insertError.message ?? "Unable to create entry.");
    }

    revalidatePath(`/sweepstakes/${sweepstakeId}`);
    revalidatePath("/account");
    revalidatePath("/sweepstakes");
    return success("Entry submitted! Good luck.");
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to submit entry.";
    return failure(message);
  }
}

export async function freeEntry(prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const sweepstakeId = formData.get("sweepstakeId");
    if (typeof sweepstakeId !== "string" || !sweepstakeId) {
      return failure("Invalid sweepstake id.");
    }

    const userWithProfile = await getCurrentUserWithProfile();
    if (!userWithProfile) {
      return failure("You must be signed in to enter.");
    }

    const { user } = userWithProfile;
    const { supabase, sweepstake } = await getActiveSweepstake(sweepstakeId);

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const { data: existingFree, error: existingError } = await supabase
      .from("entries")
      .select("id")
      .eq("sweepstake_id", sweepstake.id)
      .eq("user_id", user.id)
      .eq("entry_type", "free")
      .gte("created_at", startOfToday.toISOString())
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      return failure(existingError.message ?? "Unable to check free entry.");
    }

    if (existingFree) {
      return failure("You already used your free entry for today.");
    }

    const { error: insertError } = await supabase.from("entries").insert({
      sweepstake_id: sweepstake.id,
      user_id: user.id,
      entry_type: "free",
    });

    if (insertError) {
      return failure(insertError.message ?? "Unable to create entry.");
    }

    revalidatePath(`/sweepstakes/${sweepstakeId}`);
    revalidatePath("/account");
    revalidatePath("/sweepstakes");
    return success("Free entry submitted!");
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to submit free entry.";
    return failure(message);
  }
}

