"use client";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { usePreferences } from "@/lib/preferences";
export function Wallpaper() {
  const { wallpaper, motion } = usePreferences();
  const reduced = useReducedMotion();
  return <div aria-hidden className={`wallpaper wallpaper-${wallpaper}`}>
    {wallpaper === "signature" && <div className={`signature-motion ${motion && !reduced ? "signature-idle" : ""}`}>
      <Image src="/media/elisha-reveal-still.jpg" alt="" width={1080} height={1080} priority />
    </div>}
  </div>;
}
