"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Earn or Buy Coins",
    description: "Watch rewarded ads or grab demo Stripe packs to boost your balance instantly.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8a8.001 8.001 0 01-7.938-6.65"
          stroke="#f7c552"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7.5v9M9 10.5h5.5a2 2 0 010 4H9"
          stroke="#4fa3ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Enter Sweepstakes",
    description: "Use paid coins or your daily AMOE free entry—server actions enforce limits.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 8l6-3 6 3v5.5c0 3.5-2.5 6.6-6 7.5-3.5-.9-6-4-6-7.5V8z"
          stroke="#2f6fde"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.5 12L12 13.5 14.5 12" stroke="#f7c552" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Win Prizes",
    description: "Admin-only server button selects a random winner; results never computed client-side.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l1.9 3.9 4.3.6-3.1 3 0.7 4.2L12 13.8l-3.8 2 0.7-4.2-3.1-3 4.3-.6L12 3z"
          stroke="#9dd6ff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 20h8" stroke="#f7c552" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="relative mt-6 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-0 h-44 w-44 rounded-full bg-[#2f6fde]/20 blur-[110px]" />
        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-[#f7c552]/18 blur-[120px]" />
      </div>
      <div className="relative grid gap-6 md:grid-cols-3">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.08 }}
            className="card flex flex-col gap-3 border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                {step.icon}
              </div>
              <span className="pill text-[12px]">0{idx + 1}</span>
            </div>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="text-sm text-white/70">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


