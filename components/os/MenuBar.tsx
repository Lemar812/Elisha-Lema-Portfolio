"use client";
import { useEffect, useState } from "react";
import { useWindowStore } from "@/lib/windowStore";
import { APPS } from "@/lib/appRegistry";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { MusicControl } from "./AudioProvider";
export function MenuBar() {
  const focusedId = useWindowStore(s => s.focusedId);
  const showDesktop = useWindowStore(s => s.showDesktop);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { const tick = () => setNow(new Date()); tick(); const timer = setInterval(tick, 30000); return () => clearInterval(timer); }, []);
  return <header className="menu-bar">
    <button onClick={showDesktop} className="flex items-center gap-2.5 font-semibold" aria-label="Elisha Creatives — show desktop"><BrandLogo white signature className="h-6 w-6" /><span>Elisha Creatives</span></button>
    <span className="ml-5 hidden text-white/65 md:block">{APPS.find(a => a.id === focusedId)?.label ?? "Creative workspace"}</span>
    <div className="ml-auto mr-5"><MusicControl /></div>
    <time className=" text-xs text-white/75" dateTime={now?.toISOString()}>{now?.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
  </header>;
}
