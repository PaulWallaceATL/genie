"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { buyCoinsDemoAction, watchAdDemoAction } from "./actions";

type Props = {
  initialBalance: number;
};

export function AccountDashboard({ initialBalance }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [pending, startTransition] = useTransition();
  const [pendingBuy, startTransitionBuy] = useTransition();
  const router = useRouter();

  const handleWatchAd = () => {
    startTransition(async () => {
      const res = await watchAdDemoAction();
      setBalance(res.newBalance);
      router.refresh();
    });
  };

  const handleBuyCoins = () => {
    startTransitionBuy(async () => {
      const res = await buyCoinsDemoAction();
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
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg font-semibold text-white">Genie Coins: {balance}</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleWatchAd}
            disabled={pending}
            className="rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Granting..." : "Watch Ad (Demo) +20"}
          </button>
          <button
            type="button"
            onClick={handleBuyCoins}
            disabled={pendingBuy}
            className="rounded-2xl bg-gradient-to-r from-[#f7c552] to-[#f9e498] px-4 py-3 text-sm font-semibold text-[#0b0c16] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pendingBuy ? "Processing..." : "Buy Coins (Demo) +100"}
          </button>
        </div>
      </div>
    </section>
  );
}


