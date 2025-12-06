"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { demoPurchaseCoins, demoWatchAd } from "./actions";

type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function PendingBadge() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return <span className="animate-pulse text-[11px] text-white/70">Working…</span>;
}

function StatusToast({ state }: { state: ActionState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.status === "idle") return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, [state]);

  if (!visible || state.status === "idle") return null;

  const tone =
    state.status === "success"
      ? "bg-green-500/10 border-green-400/40 text-green-50"
      : "bg-red-500/10 border-red-400/40 text-red-100";

  return (
    <div className={`fixed bottom-5 right-5 z-50 rounded-2xl border px-4 py-3 shadow-2xl ${tone}`}>
      <p className="text-sm font-semibold">{state.message}</p>
    </div>
  );
}

const initialState: ActionState = { status: "idle" };

export function BalanceActions() {
  const [purchaseState, purchaseAction] = useFormState(demoPurchaseCoins, initialState);
  const [adState, adAction] = useFormState(demoWatchAd, initialState);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-white/0 to-white/5 p-6">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-2 h-32 w-32 rounded-full bg-[#2f6fde]/25 blur-[110px]" />
        <div className="absolute right-0 top-10 h-28 w-28 rounded-full bg-[#f7c552]/25 blur-[120px]" />
      </div>

      <div className="relative flex flex-col gap-4">
        <div>
          <p className="badge">Top up (Demo)</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Instant coins, no real charges</h3>
          <p className="text-sm text-white/70">
            Stripe and ads are mocked. Use these buttons to simulate purchases or rewarded videos.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <form action={purchaseAction} className="card flex flex-col gap-2 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-white">Buy coins (demo)</p>
                <p className="text-xs text-white/60">Select a pack to add instantly.</p>
              </div>
              <PendingBadge />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn-primary text-sm"
                name="tier"
                value="50"
                type="submit"
              >
                +50 coins
              </button>
              <button
                className="btn-ghost text-sm"
                name="tier"
                value="100"
                type="submit"
              >
                +100 coins
              </button>
            </div>
            <p className="text-[12px] text-white/60">No real payment, immediate balance update.</p>
          </form>

          <form action={adAction} className="card flex flex-col gap-3 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-white">Watch rewarded ad (demo)</p>
                <p className="text-xs text-white/60">Simulated ad event grants 20 coins.</p>
              </div>
              <PendingBadge />
            </div>
            <button type="submit" className="btn-primary text-sm">
              Start ad → collect +20 coins
            </button>
            <p className="text-[12px] text-white/60">
              We log a faux ad_reward event server-side to keep the ledger realistic.
            </p>
          </form>
        </div>
      </div>

      <StatusToast state={purchaseState} />
      <StatusToast state={adState} />
    </div>
  );
}


