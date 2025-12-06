import { NextResponse } from "next/server";
import { getCurrentUserWithProfile } from "@/lib/profile";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const PACKAGES: Record<
  string,
  {
    amountCents: number;
    coins: number;
  }
> = {
  small: { amountCents: 499, coins: 500 },
  medium: { amountCents: 999, coins: 1200 },
  large: { amountCents: 1999, coins: 2600 },
};

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

  const packageId =
    body && typeof body === "object" && "packageId" in body
      ? (body as { packageId: string }).packageId
      : null;

  if (!packageId || !PACKAGES[packageId]) {
    return NextResponse.json({ error: "Invalid packageId" }, { status: 400 });
  }

  const { user, profile } = userWithProfile;
  const supabase = getSupabaseServerClient();
  const pkg = PACKAGES[packageId];

  const { error: orderError } = await supabase.from("orders").insert({
    user_id: user.id,
    amount_cents: pkg.amountCents,
    coins_granted: pkg.coins,
    stripe_payment_id: `TEST-${crypto.randomUUID()}`,
  });

  if (orderError) {
    return NextResponse.json(
      { error: orderError.message ?? "Failed to record order" },
      { status: 500 },
    );
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coin_balance: (profile.coin_balance ?? 0) + pkg.coins })
    .eq("id", profile.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message ?? "Failed to update balance" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

