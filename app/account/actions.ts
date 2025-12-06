'use server';

import { revalidatePath } from "next/cache";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function success(message: string): ActionState {
  return { status: "success", message };
}

function failure(message: string): ActionState {
  return { status: "error", message };
}

async function requireUser() {
  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile) {
    throw new Error("You must be signed in.");
  }
  return userWithProfile;
}

export async function demoPurchaseCoins(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tier = formData.get("tier");
  if (typeof tier !== "string" || (tier !== "50" && tier !== "100")) {
    return failure("Choose a coin pack.");
  }

  let coinsToGrant = tier === "50" ? 50 : 100;
  const amountCents = tier === "50" ? 0 : 0; // demo mode, no real payment

  try {
    const { user, profile } = await requireUser();
    const supabase = await getSupabaseServerClient();

    const { error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      amount_cents: amountCents,
      coins_granted: coinsToGrant,
      stripe_payment_id: `DEMO-${crypto.randomUUID()}`,
    });

    if (orderError) {
      throw orderError;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coin_balance: (profile.coin_balance ?? 0) + coinsToGrant })
      .eq("id", profile.id);

    if (updateError) {
      throw updateError;
    }

    revalidatePath("/account");
    revalidatePath("/sweepstakes");
    return success(`Added +${coinsToGrant} coins to your balance.`);
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to add coins.";
    return failure(message);
  }
}

export async function demoWatchAd(prevState: ActionState): Promise<ActionState> {
  try {
    const { user, profile } = await requireUser();
    const supabase = await getSupabaseServerClient();

    const coinsToGrant = 20;
    const externalEventId = `demo-ad-${crypto.randomUUID()}`;

    const { error: insertError } = await supabase.from("ad_rewards").insert({
      user_id: user.id,
      network: "demo",
      external_event_id: externalEventId,
      coins_granted: coinsToGrant,
    });

    if (insertError) {
      throw insertError;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coin_balance: (profile.coin_balance ?? 0) + coinsToGrant })
      .eq("id", profile.id);

    if (updateError) {
      throw updateError;
    }

    revalidatePath("/account");
    revalidatePath("/sweepstakes");
    return success("Ad completed. +20 coins awarded.");
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to grant ad reward.";
    return failure(message);
  }
}

export async function buyCoinsDemo(prevState: ActionState): Promise<ActionState> {
  const coinsToGrant = 100;
  try {
    const { profile } = await requireUser();
    const supabase = await getSupabaseServerClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coin_balance: (profile.coin_balance ?? 0) + coinsToGrant })
      .eq("id", profile.id);

    if (updateError) {
      return failure(updateError.message ?? "Unable to add coins.");
    }

    revalidatePath("/account");
    revalidatePath("/sweepstakes");
    return success(`Added +${coinsToGrant} coins.`);
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to add coins.";
    return failure(message);
  }
}

export async function watchAdDemo(prevState: ActionState): Promise<ActionState> {
  const coinsToGrant = 20;
  try {
    const { profile } = await requireUser();
    const supabase = await getSupabaseServerClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coin_balance: (profile.coin_balance ?? 0) + coinsToGrant })
      .eq("id", profile.id);

    if (updateError) {
      return failure(updateError.message ?? "Unable to add coins.");
    }

    revalidatePath("/account");
    revalidatePath("/sweepstakes");
    return success(`Ad reward granted: +${coinsToGrant} coins.`);
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Unable to add coins.";
    return failure(message);
  }
}

// Minimal return type for client usage
export type WatchAdResult = { newBalance: number };

// Server action for demo ad reward (for client components)
export async function watchAdDemoAction(): Promise<WatchAdResult> {
  const COINS_TO_GRANT = 20;
  const userWithProfile = await getCurrentUserWithProfile();
  if (!userWithProfile) {
    throw new Error("Not authenticated");
  }

  const { user, profile } = userWithProfile;
  const supabase = await getSupabaseServerClient();

  const externalEventId = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { error: insertError } = await supabase.from("ad_rewards").insert({
    user_id: user.id,
    network: "demo",
    external_event_id: externalEventId,
    coins_granted: COINS_TO_GRANT,
  });

  if (insertError) {
    throw insertError;
  }

  const newBalance = (profile.coin_balance ?? 0) + COINS_TO_GRANT;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coin_balance: newBalance })
    .eq("auth_user_id", user.id);

  if (updateError) {
    throw updateError;
  }

  return { newBalance };
}


