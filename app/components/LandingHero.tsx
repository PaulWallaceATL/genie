"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoMark } from "./LogoMark";

const blobTransition = {
  repeat: Infinity,
  repeatType: "mirror" as const,
  duration: 12,
  ease: "easeInOut",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1530] via-[#060b18] to-[#050911] p-10 shadow-2xl">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#2f6fde]/30 blur-[120px]"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0], scale: [1, 1.12, 1, 1] }}
          transition={blobTransition}
        />
        <motion.div
          className="absolute -right-10 top-12 h-64 w-64 rounded-full bg-[#f7c552]/26 blur-[120px]"
          animate={{ x: [0, -20, 30, 0], y: [0, 16, -12, 0], scale: [1, 1.08, 1, 1] }}
          transition={{ ...blobTransition, duration: 10 }}
        />
        <motion.div
          className="absolute left-1/3 bottom-0 h-72 w-96 -translate-x-1/2 rounded-full bg-[#0b1a34]/70 blur-[140px]"
          animate={{ x: [0, 20, -30, 0], opacity: [0.65, 0.9, 0.7, 0.65] }}
          transition={{ ...blobTransition, duration: 14 }}
        />
        <div className="absolute inset-0 grid-dots opacity-40" />
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-6">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="badge w-fit"
          >
            <LogoMark size={18} />
            Verified sweepstakes · AMOE-ready
          </motion.span>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Win Big With Genie.
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Earn coins. Enter sweepstakes. Unlock magic with a premium, server-trusted experience—
              paid, earned, or free AMOE every day.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.18 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link href="/sweepstakes" className="btn-primary text-sm">
              Browse Sweepstakes
            </Link>
            <Link href="/auth" className="btn-ghost text-sm">
              Sign In
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.26 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {[
              { title: "Instant coin boosts", detail: "Demo Stripe + rewarded ads for balance gains." },
              { title: "AMOE enforced", detail: "One free entry per sweepstake per day, server-side." },
              { title: "Backend-trusted", detail: "Winner selection never leaves the server." },
            ].map((item) => (
              <div key={item.title} className="card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-white/80">{item.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute -inset-6 rounded-[26px] bg-gradient-to-tr from-[#2f6fde]/25 via-transparent to-[#f7c552]/25 blur-2xl" />
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,111,222,0.2),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(247,197,82,0.25),transparent_40%)] opacity-90" />
            <div className="relative flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="pill text-[11px]">Live draws</span>
                <span className="text-xs text-white/60">Secure server logic</span>
              </div>
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Next prize pool</span>
                  <span className="text-lg font-semibold text-white">$5,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <CoinSpinner />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Floating Genie Coin</p>
                    <p className="text-xs text-white/60">Earn, buy, or claim AMOE.</p>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#2f6fde] via-[#4fa3ff] to-[#f7c552]"
                    animate={{ width: ["45%", "85%", "60%", "90%", "70%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Entries filling fast</span>
                  <span className="pill text-[11px] bg-white/10">Demo speed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CoinSpinner() {
  return (
    <div className="relative h-16 w-16">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f7c552] via-[#f9e498] to-[#d9a53b] shadow-[0_10px_30px_rgba(247,197,82,0.35)]"
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-2 rounded-full border border-white/20 bg-white/10" />
      <div className="absolute inset-4 rounded-full border border-white/30 bg-[#0b1224]/70" />
      <div className="absolute inset-0 grid place-items-center">
        <LogoMark size={26} />
      </div>
    </div>
  );
}


