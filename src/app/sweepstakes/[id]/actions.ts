'use server';

import { revalidatePath } from "next/cache";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

type Sweepstake = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string;
  prize_value_cents: number | null;
};

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

export async function enterWithCoin(formData: FormData) {
  const sweepstakeId = formData.get("sweepstakeId");
  if (typeof sweepstakeId !== "string" || !sweepstakeId) {
    throw new Error("Invalid sweepstake id.");
  }

  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile) {
    throw new Error("You must be signed in to enter.");
  }

  const { user, profile } = userWithProfile;
  const { supabase, sweepstake } = await getActiveSweepstake(sweepstakeId);

  const currentBalance = profile.coin_balance ?? 0;
  if (currentBalance < 1) {
    throw new Error("Not enough Genie Coins for a paid entry.");
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coin_balance: currentBalance - 1 })
    .eq("id", profile.id);

  if (updateError) {
    throw updateError;
  }

  const { error: insertError } = await supabase.from("entries").insert({
    sweepstake_id: sweepstake.id,
    user_id: user.id,
    entry_type: "paid",
  });

  if (insertError) {
    throw insertError;
  }

  revalidatePath(`/sweepstakes/${sweepstakeId}`);
}

export async function freeEntry(formData: FormData) {
  const sweepstakeId = formData.get("sweepstakeId");
  if (typeof sweepstakeId !== "string" || !sweepstakeId) {
    throw new Error("Invalid sweepstake id.");
  }

  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile) {
    throw new Error("You must be signed in to enter.");
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
    throw existingError;
  }

  if (existingFree) {
    throw new Error("You already used your free entry for today.");
  }

  const { error: insertError } = await supabase.from("entries").insert({
    sweepstake_id: sweepstake.id,
    user_id: user.id,
    entry_type: "free",
  });

  if (insertError) {
    throw insertError;
  }

  revalidatePath(`/sweepstakes/${sweepstakeId}`);
}

