"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { enterWithCoin, freeEntry, type ActionState } from "./actions";

const initialState: ActionState = { status: "idle" };

type Props = {
  sweepstakeId: string;
  isActive: boolean;
  hasFreeToday: boolean;
  balance: number | null | undefined;
  entriesCount: number;
};

export function EntryActions({ sweepstakeId, isActive, hasFreeToday, balance, entriesCount }: Props) {
  const [paidState, paidAction] = useFormState(enterWithCoin, initialState);
  const [freeState, freeAction] = useFormState(freeEntry, initialState);

  const disabled = !isActive;

  return (
    <div className="card flex flex-col gap-5 border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-white">Enter this sweepstake</p>
          <p className="text-xs text-white/70">
            1 coin per paid entry. Free AMOE entry once per day. Current entries: {entriesCount}.
          </p>
        </div>
        <div className="pill text-xs font-semibold text-white">
          Balance: {balance ?? 0} coins
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <form action={paidAction}>
          <input type="hidden" name="sweepstakeId" value={sweepstakeId} />
          <AnimatedButton disabled={disabled} tone="primary">
            Enter with 1 Coin
          </AnimatedButton>
        </form>
        <form action={freeAction}>
          <input type="hidden" name="sweepstakeId" value={sweepstakeId} />
          <AnimatedButton disabled={disabled || hasFreeToday} tone="ghost">
            {hasFreeToday ? "Free entry used today" : "Free Entry (Once Daily)"}
          </AnimatedButton>
        </form>
      </div>

      <FeedbackBanner state={paidState.status !== "idle" ? paidState : freeState} />
    </div>
  );
}

function AnimatedButton({
  children,
  tone,
  disabled,
}: {
  children: React.ReactNode;
  tone: "primary" | "ghost";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const base =
    tone === "primary"
      ? "btn-primary text-sm px-5 py-3"
      : "btn-ghost text-sm px-5 py-3 border-white/20";

  return (
    <motion.button
      type="submit"
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      disabled={disabled || pending}
      className={`${base} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? "Working..." : children}
    </motion.button>
  );
}

function FeedbackBanner({ state }: { state: ActionState }) {
  useEffect(() => {
    if (state.status === "idle") return;
  }, [state]);

  return (
    <AnimatePresence>
      {state.status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.status === "success"
              ? "border-green-400/40 bg-green-500/10 text-green-50"
              : "border-red-400/40 bg-red-500/10 text-red-100"
          }`}
        >
          {state.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


