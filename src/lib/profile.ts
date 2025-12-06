import { type User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type Profile = {
  id: string;
  auth_user_id: string;
  email: string;
  display_name: string | null;
  country: string | null;
  state: string | null;
  age_verified: boolean;
  coin_balance: number;
  created_at: string;
};

const PROFILE_COLUMNS =
  "id, auth_user_id, email, display_name, country, state, age_verified, coin_balance, created_at";

export async function ensureUserProfile(): Promise<{ user: User; profile: Profile } | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authResult, error: authError } = await supabase.auth.getUser();

    if (authError || !authResult?.user) {
      if (authError?.status !== 401) {
        console.error("ensureUserProfile auth error", authError);
      }
      return null;
    }

    const user = authResult.user;

    const { data: existingProfile, error: existingError } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      console.error("ensureUserProfile existing profile error", existingError);
    }

    if (existingProfile) {
      return { user, profile: existingProfile as Profile };
    }

    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        auth_user_id: user.id,
        email: user.email ?? "",
        coin_balance: 0,
      })
      .select(PROFILE_COLUMNS)
      .single();

    if (insertError || !newProfile) {
      console.error("ensureUserProfile insert error", insertError);
      return null;
    }

    return { user, profile: newProfile as Profile };
  } catch (err) {
    console.error("ensureUserProfile unexpected error", err);
    return null;
  }
}

export async function getCurrentUserWithProfile(): Promise<{ user: User; profile: Profile } | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: authResult, error: authError } = await supabase.auth.getUser();

    if (authError || !authResult?.user) {
      if (authError && authError.status !== 401) {
        console.error("getCurrentUserWithProfile auth error", authError);
      }
      return null;
    }

    const user = authResult.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("getCurrentUserWithProfile profile error", profileError);
      return null;
    }

    if (!profile) {
      return null;
    }

    return { user, profile: profile as Profile };
  } catch (err) {
    console.error("getCurrentUserWithProfile unexpected error", err);
    return null;
  }
}
