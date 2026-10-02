"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { usePreferences } from "@/lib/preferences";
export function Wallpaper() {
  const { wallpaper, motion } = usePreferences();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => { setReady(true); }, []);
  const animate = ready && motion && !reduced && wallpaper === "signature";
  useEffect(() => {
    const player = video.current;
    if (!animate || !player) return;
    const play = () => { if (!document.hidden) void player.play().catch(() => {}); };
    const visibility = () => { if (document.hidden) player.pause(); else play(); };
    document.addEventListener("visibilitychange", visibility);
    play();
    return () => { player.pause(); document.removeEventListener("visibilitychange", visibility); };
  }, [animate]);
  return <div aria-hidden className={`wallpaper wallpaper-${wallpaper}`}>
    {wallpaper === "signature" && <div className="signature-motion">{animate
      ? <video ref={video} src="/media/elisha-motion.mp4" muted playsInline loop preload="metadata" />
      : <BrandLogo white signature className="h-full w-full" />}</div>}
  </div>;
}
