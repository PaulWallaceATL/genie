"use server";

import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type WatchAdResult = { newBalance: number };

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


