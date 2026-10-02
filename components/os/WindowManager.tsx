"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { APPS } from "@/lib/appRegistry";
import { useWindowStore } from "@/lib/windowStore";
import { Window } from "./Window";
export function WindowManager({ mobile }: { mobile: boolean }) {
  const windows = useWindowStore(s => s.windows);
  const ref = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState({ width: 1000, height: 650 });
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => setArea({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`workspace ${mobile ? "mobile-workspace" : ""}`}>
    <AnimatePresence>{APPS.filter(app => windows[app.id].isOpen).map(app => {
      const Component = app.Component;
      return <Window key={app.id} id={app.id} title={app.title} width={app.width} height={app.height} area={area} mobile={mobile}><Component /></Window>;
    })}</AnimatePresence>
  </div>;
}
