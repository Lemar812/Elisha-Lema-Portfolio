"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { usePreferences } from "@/lib/preferences";
export function Wallpaper() {
  const { wallpaper, motion } = usePreferences();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => { setReady(true); }, []);
  const animate = ready && motion && !reduced && wallpaper === "signature";
  useEffect(() => {
    const player = video.current;
    if (!animate || revealed || !player) return;
    const play = () => { if (!document.hidden && !player.ended) void player.play().catch(() => {}); };
    const visibility = () => { if (document.hidden) player.pause(); else play(); };
    document.addEventListener("visibilitychange", visibility);
    play();
    return () => { player.pause(); document.removeEventListener("visibilitychange", visibility); };
  }, [animate, revealed]);
  return <div aria-hidden className={`wallpaper wallpaper-${wallpaper}`}>
    {wallpaper === "signature" && <div className={`signature-motion ${animate && revealed ? "signature-idle" : ""}`}>
      <Image src="/media/elisha-reveal-still.jpg" alt="" width={1080} height={1080} priority style={{ opacity: animate && !revealed ? 0 : 1 }} />
      {animate && !revealed && <video ref={video} src="/media/elisha-reveal.mp4" muted autoPlay playsInline preload="auto" onEnded={() => setRevealed(true)} onError={() => setRevealed(true)} />}
    </div>}
  </div>;
}
