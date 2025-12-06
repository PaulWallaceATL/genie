"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoMark } from "./LogoMark";

export function PageLoader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsActive(true);
    const timer = setTimeout(() => setIsActive(false), 750);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="page-loader" data-hidden={!isActive}>
      <div className="relative flex flex-col items-center justify-center">
        <div className="loader-orb">
          <LogoMark size={44} className="relative z-10 translate-y-[2px]" />
        </div>
        <p className="mt-4 text-sm font-semibold text-white/80">Summoning the genie...</p>
      </div>
    </div>
  );
}

