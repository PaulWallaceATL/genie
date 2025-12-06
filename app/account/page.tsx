import Link from "next/link";
import { AccountDashboard } from "./AccountDashboard";
import { getCurrentUserWithProfile } from "@/lib/profile";

export default async function AccountPage() {
  const userWithProfile = await getCurrentUserWithProfile();

  if (!userWithProfile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
        <div className="card border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">Please sign in to view your account.</p>
          <div className="mt-3 flex gap-3">
            <Link href="/auth" className="btn-primary text-sm">
              Go to sign in
            </Link>
            <Link href="/sweepstakes" className="btn-ghost text-sm">
              Browse sweepstakes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
      <AccountDashboard initialBalance={userWithProfile.profile.coin_balance ?? 0} />
    </main>
  );
}

