"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { watchAdDemoAction } from "./actions";

type Props = {
  initialBalance: number;
};

export function AccountDashboard({ initialBalance }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleWatchAd = () => {
    startTransition(async () => {
      const res = await watchAdDemoAction();
      setBalance(res.newBalance);
      router.refresh();
    });
  };

  return (
    <section className="card flex flex-col gap-4 border border-white/10 bg-white/5 p-6 shadow-xl">
      <div>
        <p className="badge">Account</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Your Genie Coins</h1>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-lg font-semibold text-white">Genie Coins: {balance}</div>
        <button
          type="button"
          onClick={handleWatchAd}
          disabled={pending}
          className="rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Granting..." : "Watch Ad (Demo) +20 Coins"}
        </button>
      </div>
    </section>
  );
}


