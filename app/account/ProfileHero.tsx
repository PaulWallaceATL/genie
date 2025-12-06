"use client";

import { useEffect, useMemo } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { buyCoinsDemo, watchAdDemo } from "./actions";

type ActionState = { status: "idle" | "success" | "error"; message?: string };

const initialState: ActionState = { status: "idle" };

type Props = {
  email: string | null;
  balance: number;
};

export function ProfileHero({ email, balance }: Props) {
  const [purchaseState, purchaseAction] = useFormState(buyCoinsDemo, initialState);
  const [adState, adAction] = useFormState(watchAdDemo, initialState);

  const displayBalance = useAnimatedNumber(balance);
  const avatarLetter = useMemo(() => (email?.[0]?.toUpperCase() ?? "G"), [email]);

  const feedback = purchaseState.status !== "idle" ? purchaseState : adState;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-[#2f6fde]/25 blur-[130px]" />
        <div className="absolute right-0 top-4 h-40 w-40 rounded-full bg-[#f7c552]/25 blur-[130px]" />
        <Sparkles />
      </div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white ring-1 ring-white/15">
            {avatarLetter}
          </div>
          <div>
            <p className="text-sm text-white/60">Signed in as</p>
            <p className="text-base font-semibold text-white">{email ?? "Genie user"}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-amber-200/40 bg-gradient-to-r from-[#f7c552]/30 via-[#4fa3ff]/20 to-[#f7c552]/25 px-6 py-4 shadow-[0_18px_50px_rgba(247,197,82,0.25)] backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.18),transparent_40%)] opacity-70" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b1224]/70 ring-2 ring-amber-200/60 shadow-inner">
              <CoinIcon />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Coin balance</p>
              <motion.p className="text-2xl font-semibold text-white drop-shadow">
                {displayBalance}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <form action={purchaseAction}>
          <GlowingButton tone="gold">Buy Coins (Demo) · +100</GlowingButton>
        </form>
        <form action={adAction}>
          <GlowingButton tone="blue">Watch Ad (Demo) · +20</GlowingButton>
        </form>
      </div>

      <Feedback state={feedback} />
    </div>
  );
}

function useAnimatedNumber(value: number) {
  const motionValue = useMotionValue(value);
  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [motionValue, value]);

  const rounded = Math.round(motionValue.get());
  return rounded.toLocaleString();
}

function GlowingButton({
  children,
  tone,
  value,
  name,
}: {
  children: React.ReactNode;
  tone: "gold" | "blue";
  value?: string;
  name?: string;
}) {
  const { pending } = useFormStatus();
  const gradient =
    tone === "gold"
      ? "from-[#f7c552] via-[#f7d98a] to-[#f7c552]"
      : "from-[#2f6fde] via-[#4fa3ff] to-[#2f6fde]";
  return (
    <motion.button
      type="submit"
      name={name}
      value={value}
      whileHover={{ scale: 1.02, boxShadow: "0 18px 40px rgba(0,0,0,0.25)" }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full overflow-hidden rounded-2xl px-4 py-3 text-center text-sm font-semibold text-[#0b0c16] shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
      disabled={pending}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
      <div className="absolute inset-0 blur-xl opacity-50" />
      <span className="relative">{pending ? "Working..." : children}</span>
    </motion.button>
  );
}

function Feedback({ state }: { state: ActionState }) {
  return (
    <AnimatePresence>
      {state.status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
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

function CoinIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGrad" x1="4" y1="8" x2="60" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7C552" />
          <stop offset="1" stopColor="#F9E498" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="26" fill="url(#coinGrad)" stroke="#F7E9B0" strokeWidth="3" />
      <circle cx="32" cy="32" r="17" fill="#0b1224" opacity="0.65" />
      <path
        d="M26 26.5h12a3.5 3.5 0 0 1 0 7H30m-4 0h12a3.5 3.5 0 0 1 0 7H26"
        stroke="#F7E9B0"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkles() {
  const dots = Array.from({ length: 26 });
  return (
    <div className="absolute inset-0">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-white/70"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: "0 0 10px rgba(255,255,255,0.8)",
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 2.4 + Math.random() * 1.5, repeat: Infinity, delay: Math.random() * 1.2 }}
        />
      ))}
    </div>
  );
}


