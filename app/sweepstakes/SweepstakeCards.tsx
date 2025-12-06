"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type SweepstakeCard = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string;
  prize_value_cents: number | null;
};

function formatPrize(cents: number | null) {
  if (cents == null) return null;
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function endsIn(endAt: string) {
  const end = new Date(endAt).getTime();
  const diff = end - Date.now();
  if (!Number.isFinite(end) || diff <= 0) return "Ends soon";
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  return `Ends in ${days} day${days === 1 ? "" : "s"}`;
}

export function SweepstakeCards({ sweepstakes }: { sweepstakes: SweepstakeCard[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sweepstakes.map((item, idx) => {
        const prize = formatPrize(item.prize_value_cents);
        return (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 70px rgba(0,0,0,0.35)" }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-white/8 to-white/3 opacity-70 pointer-events-none" />
            <div className="relative rounded-2xl border border-white/14 bg-white/8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <div className="relative">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-white/5 text-sm text-white/60">
                    Image coming soon
                  </div>
                )}
                {prize ? (
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-gradient-to-r from-[#2f6fde] to-[#4fa3ff] px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur">
                    {prize}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white leading-tight">{item.title}</h3>
                </div>
                <p className="text-sm text-white/70 line-clamp-3">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span className="pill bg-white/5 text-[11px]">{endsIn(item.end_at)}</span>
                  <span className="text-white/60">
                    Ends {new Date(item.end_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Live now
                  </div>
                  <Link
                    href={`/sweepstakes/${item.id}`}
                    className="btn-primary text-xs px-3 py-2"
                  >
                    Enter Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}


