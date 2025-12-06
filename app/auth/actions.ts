'use server';

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

function normalizeError(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Something went wrong. Please try again.";
}

export async function signInAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: normalizeError(error) };
  }

  redirect("/sweepstakes");
}

export async function signUpAction(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/` },
  });

  if (error) {
    return { error: normalizeError(error) };
  }

  redirect("/sweepstakes");
}

export async function signOutAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/sweepstakes");
}

