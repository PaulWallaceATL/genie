"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SweepstakeRow = {
  id: string;
  title: string;
  is_active: boolean;
  start_at: string;
  end_at: string;
  winner_user_id: string | null;
};

type ActionState = { status: "idle" | "success" | "error"; message?: string };

type ActionFn = (formData: FormData) => Promise<ActionState>;

export function SweepstakeAdminTable({
  sweepstakes,
  onPickWinner,
  onClose,
}: {
  sweepstakes: SweepstakeRow[];
  onPickWinner: ActionFn;
  onClose: ActionFn;
}) {
  const [toast, setToast] = useState<ActionState>({ status: "idle" });

  const handleAction = async (action: ActionFn, id: string) => {
    const data = new FormData();
    data.set("sweepstakeId", id);
    const res = await action(data);
    setToast(res);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-white/60">
            <tr>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Start</th>
              <th className="px-3 py-3">End</th>
              <th className="px-3 py-3">Winner</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/85">
            {sweepstakes.map((s) => (
              <tr key={s.id} className="transition hover:bg-white/5">
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">{s.title}</span>
                    <span className="text-[11px] text-white/50">{s.id}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      s.is_active
                        ? "bg-green-500/15 text-green-100"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-3 text-white/70">
                  {new Date(s.start_at).toLocaleString()}
                </td>
                <td className="px-3 py-3 text-white/70">
                  {new Date(s.end_at).toLocaleString()}
                </td>
                <td className="px-3 py-3 text-xs text-white/70">
                  {s.winner_user_id ?? "—"}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap justify-end gap-2 text-xs">
                    <Link
                      href={`/sweepstakes/${s.id}`}
                      className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:border-white/40 hover:bg-white/10"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAction(onClose, s.id)}
                      disabled={!s.is_active}
                      className="rounded-full border border-white/20 px-3 py-1 text-white/80 transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(onPickWinner, s.id)}
                      disabled={!s.is_active}
                      className="rounded-full bg-gradient-to-r from-[#2f6fde] to-[#4fa3ff] px-3 py-1 font-semibold text-[#061025] shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Pick Winner
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sweepstakes.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-sm text-white/60" colSpan={6}>
                  No sweepstakes created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {toast.status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`pointer-events-auto absolute right-4 top-4 rounded-2xl border px-4 py-3 text-sm shadow-2xl ${
              toast.status === "success"
                ? "border-green-400/40 bg-green-500/10 text-green-50"
                : "border-red-400/40 bg-red-500/10 text-red-100"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


