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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Genie Sweepstakes
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">Sign in or create an account</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Use email + password for now. After signing in you can enter sweepstakes and
            access admin (if approved).
          </p>
        </div>
        <Link
          href="/sweepstakes"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to sweepstakes
        </Link>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {userWithProfile ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4">
          <p className="text-sm font-semibold text-green-800">
            You’re signed in as {userWithProfile.user.email ?? "user"}.
          </p>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <form action={signInAction} className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Sign in</h2>
            <label className="text-sm text-zinc-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </label>
            <label className="text-sm text-zinc-700">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </label>
            <button
              type="submit"
              className="mt-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Sign in
            </button>
          </form>

          <form action={signUpAction} className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Create account</h2>
            <label className="text-sm text-zinc-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </label>
            <label className="text-sm text-zinc-700">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </label>
            <button
              type="submit"
              className="mt-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Sign up
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

