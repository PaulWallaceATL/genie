import { NextResponse } from "next/server";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const userWithProfile = await getCurrentUserWithProfile();

  if (!userWithProfile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { network, external_event_id, coins } =
    typeof body === "object" && body !== null
      ? (body as {
          network?: unknown;
          external_event_id?: unknown;
          coins?: unknown;
        })
      : {};

  if (
    typeof network !== "string" ||
    typeof external_event_id !== "string" ||
    (typeof coins !== "number" && typeof coins !== "string")
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const coinsNumber = typeof coins === "string" ? Number.parseInt(coins, 10) : coins;

  if (!Number.isFinite(coinsNumber) || coinsNumber <= 0) {
    return NextResponse.json({ error: "Coins must be a positive number" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();

  const { data: existingReward, error: existingError } = await supabase
    .from("ad_rewards")
    .select("id")
    .eq("network", network)
    .eq("external_event_id", external_event_id)
    .maybeSingle();

  if (existingError && existingError.code !== "PGRST116") {
    return NextResponse.json(
      { error: existingError.message ?? "Failed to check reward" },
      { status: 500 },
    );
  }

  if (existingReward) {
    return NextResponse.json(
      { error: "Reward already granted for this event" },
      { status: 409 },
    );
  }

  const { user, profile } = userWithProfile;

  const { error: insertError } = await supabase.from("ad_rewards").insert({
    user_id: user.id,
    network,
    external_event_id,
    coins_granted: coinsNumber,
  });

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message ?? "Failed to record reward" },
      { status: 500 },
    );
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coin_balance: (profile.coin_balance ?? 0) + coinsNumber })
    .eq("id", profile.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message ?? "Failed to update balance" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

