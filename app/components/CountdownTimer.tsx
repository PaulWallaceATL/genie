"use client";

import { useEffect, useState } from "react";

function getTimeRemaining(target: string) {
  const end = new Date(target).getTime();
  const diff = end - Date.now();
  if (Number.isNaN(end) || diff <= 0) {
    return { done: true, label: "Closed" };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    days > 0 ? `${days}d` : null,
    `${hours.toString().padStart(2, "0")}h`,
    `${minutes.toString().padStart(2, "0")}m`,
    `${seconds.toString().padStart(2, "0")}s`,
  ].filter(Boolean);

  return { done: false, label: parts.join(" ") };
}

export function CountdownTimer({ endAt }: { endAt: string }) {
  const [display, setDisplay] = useState(() => getTimeRemaining(endAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(getTimeRemaining(endAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  return (
    <span className={`pill text-[11px] ${display.done ? "bg-white/5 text-white/60" : ""}`}>
      {display.label}
    </span>
  );
}


