import Link from "next/link";
import { signInAction, signOutAction, signUpAction } from "./actions";
import { getCurrentUserWithProfile } from "@/lib/profile";

const modeLabels = {
  signin: {
    title: "Sign in",
    subtitle: "Use your email to enter raffles and view your account.",
    cta: "Sign in",
    switchLabel: "Need an account?",
    switchHref: "/auth?mode=signup",
    switchText: "Create one",
  },
  signup: {
    title: "Create account",
    subtitle: "Set up your Genie profile to start earning and entering.",
    cta: "Sign up",
    switchLabel: "Already have an account?",
    switchHref: "/auth?mode=signin",
    switchText: "Sign in",
  },
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: { error?: string; mode?: string };
}) {
  const userWithProfile = await getCurrentUserWithProfile();
  const errorMessage = searchParams?.error;
  const mode = searchParams?.mode === "signup" ? "signup" : "signin";
  const labels = modeLabels[mode];

  if (userWithProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="card border border-green-400/40 bg-green-500/10 px-4 py-4">
          <p className="text-sm font-semibold text-green-100">
            You’re signed in as {userWithProfile.user.email ?? "user"}.
          </p>
          <div className="mt-3 flex gap-3">
            <form action={signOutAction}>
              <button type="submit" className="btn-ghost text-sm">
                Sign out
              </button>
            </form>
            <Link href="/sweepstakes" className="pill text-sm">
              Back to sweepstakes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-14">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#2f6fde]/25 blur-[110px]" />
          <div className="absolute right-0 top-6 h-36 w-36 rounded-full bg-[#f7c552]/22 blur-[120px]" />
        </div>
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="badge w-fit">Genie Sweepstakes</p>
            <h1 className="text-3xl font-semibold text-white">{labels.title}</h1>
            <p className="text-sm text-white/70">{labels.subtitle}</p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>{labels.switchLabel}</span>
              <Link href={labels.switchHref} className="text-white underline underline-offset-4">
                {labels.switchText}
              </Link>
            </div>
          </div>
          <Link href="/sweepstakes" className="pill text-sm">
            ← Back to sweepstakes
          </Link>
        </div>
      </div>

      {errorMessage ? (
        <div className="card border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      <div className="card relative overflow-hidden border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-[#2f6fde]/20 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-32 w-40 rounded-full bg-[#f7c552]/18 blur-[110px]" />
        </div>
        <div className="relative">
          <h2 className="text-xl font-semibold text-white">{labels.title}</h2>
          <p className="text-sm text-white/60">{labels.subtitle}</p>
          <form
            action={mode === "signup" ? signUpAction : signInAction}
            className="mt-4 flex flex-col gap-3"
          >
            <label className="text-sm text-white/70">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full text-sm"
              />
            </label>
            <label className="text-sm text-white/70">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full text-sm"
              />
            </label>
            <button
              type="submit"
              className={mode === "signup" ? "btn-ghost text-sm" : "btn-primary text-sm"}
            >
              {labels.cta}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

