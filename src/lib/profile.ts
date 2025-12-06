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

export async function ensureUserProfile(authUserId: string): Promise<Profile> {
  const supabase = await getSupabaseServerClient();

  const { data: existingProfile, error: existingError } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile;
  }

  if (existingError && existingError.code !== "PGRST116") {
    throw existingError;
  }

  const { data: authResult, error: authError } = await supabase.auth.getUser();

  if (authError || !authResult?.user) {
    throw new Error("Unable to load authenticated user for profile creation.");
  }

  if (authResult.user.id !== authUserId) {
    throw new Error("Authenticated user mismatch while ensuring profile.");
  }

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      auth_user_id: authUserId,
      email: authResult.user.email ?? "",
      coin_balance: 0,
    })
    .select(PROFILE_COLUMNS)
    .single();

  if (insertError || !newProfile) {
    throw insertError ?? new Error("Failed to create profile.");
  }

  return newProfile;
}

export async function getCurrentUserWithProfile(): Promise<{
  user: User;
  profile: Profile;
} | null> {
  const supabase = await getSupabaseServerClient();

  const { data: authResult, error: authError } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const user = authResult?.user;

  if (!user) {
    return null;
  }

  const profile = await ensureUserProfile(user.id);

  return { user, profile };
}

