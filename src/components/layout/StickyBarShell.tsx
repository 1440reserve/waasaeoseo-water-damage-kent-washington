"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveals the mobile sticky call bar only after the visitor scrolls past
 * the hero, so it does not dominate the first paint. Slides back down when
 * they return to the top. Respects prefers-reduced-motion via CSS.
 */
export function StickyBarShell({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line-soft shadow-[0_-6px_24px_rgba(0,0,0,0.10)] transition-transform duration-300 will-change-transform motion-reduce:transition-none md:hidden",
        shown ? "translate-y-0" : "translate-y-full"
      )}
    >
      {children}
    </div>
  );
}
