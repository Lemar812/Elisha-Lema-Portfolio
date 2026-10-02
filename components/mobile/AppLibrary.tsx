"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { APPS } from "@/lib/appRegistry";
import { SearchIcon } from "@/lib/icons";
import { MusicControl } from "@/components/os/AudioProvider";
import { BrandLogo } from "@/components/shared/BrandLogo";
import type { AppId } from "@/lib/windowStore";
export function AppLibrary({ onOpenApp, onClose, modal = false }: { onOpenApp: (id: AppId) => void; onClose?: () => void; modal?: boolean }) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const filtered = APPS.filter(app => app.label.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, [modal]);
  return <motion.div ref={ref} role={modal ? "dialog" : undefined} aria-modal={modal || undefined} aria-label="App Library" className={`app-library ${modal ? "library-modal" : ""}`}
    initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }}
    onKeyDown={event => {
      if (event.key === "Escape") { event.stopPropagation(); onClose?.(); }
      if (modal && event.key === "Tab") {
        const nodes = Array.from(ref.current?.querySelectorAll<HTMLElement>("button,input") ?? []);
        const first = nodes[0], last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
    <div className="mb-8 flex items-center justify-between"><BrandLogo white className="w-60" />{onClose && <button onClick={onClose} className="library-close" aria-label="Close App Library">×</button>}</div>
    <p className="eyebrow text-white/65">Your creative workspace</p>
    <h2 className="mb-6 mt-2 text-2xl font-semibold">Explore Elisha Creatives</h2>
    <label className="search-field"><SearchIcon className="h-5 w-5" /><span className="sr-only">Search apps</span><input ref={input} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search apps" /></label>
    <div className="library-grid">{filtered.map(app => { const Icon = app.icon; return <button key={app.id} onClick={() => onOpenApp(app.id)}><span className="library-icon"><Icon className="h-7 w-7" /></span><span>{app.label}</span></button>; })}</div>
    {!filtered.length && <p role="status" className="mt-8 text-white/75">No apps match “{query}”. Try Works or Contact.</p>}
    <div className="mt-8"><MusicControl /></div>
    <p className="mt-10 text-sm text-white/60">Design & web development · Tanzania</p>
  </motion.div>;
}
