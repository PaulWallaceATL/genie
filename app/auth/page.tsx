import Link from "next/link";
import { signInAction, signOutAction, signUpAction } from "./actions";
import { getCurrentUserWithProfile } from "@/lib/profile";

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const userWithProfile = await getCurrentUserWithProfile();
  const errorMessage = searchParams?.error;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex items-start justify-between rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="space-y-3">
          <p className="badge w-fit">Genie Sweepstakes</p>
          <h1 className="text-3xl font-semibold text-white">Sign in or create an account</h1>
          <p className="text-sm text-white/70">
            Use email + password for now. After signing in you can enter sweepstakes and access admin
            (if approved).
          </p>
        </div>
        <Link href="/sweepstakes" className="pill text-sm">
          ← Back to sweepstakes
        </Link>
      </div>

      {errorMessage ? (
        <div className="card border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      {userWithProfile ? (
        <div className="card border border-green-400/40 bg-green-500/10 px-4 py-4">
          <p className="text-sm font-semibold text-green-100">
            You’re signed in as {userWithProfile.user.email ?? "user"}.
          </p>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="btn-ghost text-sm"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <form action={signInAction} className="card flex flex-col gap-3 border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white">Sign in</h2>
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
              className="mt-2 btn-primary text-sm"
            >
              Sign in
            </button>
          </form>

          <form action={signUpAction} className="card flex flex-col gap-3 border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white">Create account</h2>
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
              className="mt-2 btn-ghost text-sm"
            >
              Sign up
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

