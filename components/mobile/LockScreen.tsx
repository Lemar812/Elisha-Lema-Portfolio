"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/shared/BrandLogo";
export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const startY = useRef<number | null>(null);
  const reduced = useReducedMotion();
  return <motion.div className="lock-screen" initial={false} exit={{ opacity: 0, y: reduced ? 0 : -60 }} transition={{ duration: reduced ? 0 : 0.25 }}
    onTouchStart={e => { startY.current = e.touches[0].clientY; }}
    onTouchEnd={e => { if (startY.current !== null && startY.current - e.changedTouches[0].clientY > 60) onUnlock(); startY.current = null; }}>
    <div className="eyebrow text-white/65">Independent design & development</div>
    <div><BrandLogo white className="mx-auto mb-10 w-72 max-w-full" /><h1 className="text-3xl font-semibold leading-tight">Good design.<br />A stronger presence.</h1><p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-white/75">Graphic design and websites by Elisha Lema, Tanzania.</p></div>
    <div><button id="unlock-button" onClick={onUnlock} className="button-light">Enter workspace <span aria-hidden>↑</span></button><p className="mt-4 text-xs text-white/65">Tap to enter or swipe up</p></div>
  </motion.div>;
}
