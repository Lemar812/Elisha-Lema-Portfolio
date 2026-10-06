"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { Wallpaper } from "./Wallpaper";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";
import { AudioProvider } from "./AudioProvider";
import { APPS } from "@/lib/appRegistry";
import { Intro } from "./Intro";
import { AppLibrary } from "@/components/mobile/AppLibrary";
import { APP_IDS, useWindowStore, type AppId } from "@/lib/windowStore";
import { useIsMobile } from "@/lib/useIsMobile";
import { works } from "@/data/works";
export function PortfolioShell() {
  const mobile = useIsMobile();
  const [entry, setEntry] = useState<"pending" | "intro" | "desktop">("pending");
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem("elisha-intro-seen", "1"); } catch { /* Storage may be disabled. */ }
    setEntry("desktop");
  }, []);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("elisha-intro-seen") === "1"; } catch { /* Continue without persistence. */ }
    const deepLink = APP_IDS.includes(window.location.hash.slice(1).split("/")[0] as AppId);
    const reloading = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type === "reload";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEntry(reducedMotion || (!reloading && (seen || deepLink)) ? "desktop" : "intro");
  }, []);
  const { focusedId, libraryOpen, openApp, showLibrary } = useWindowStore();
  const previousFocus = useRef<AppId | null>(null);
  useEffect(() => {
    const readHash = (event?: Event) => {
      const [id, workId] = window.location.hash.slice(1).split("/");
      const state = useWindowStore.getState();
      if (APP_IDS.includes(id as AppId)) {
        const work = works.find(w => w.id === workId);
        if (id === "works" && work) state.selectWork(work.id, work.category);
        state.openApp(id as AppId);
        if (event) setEntry("desktop");
      } else if (!id) state.showDesktop();
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    const unsubscribe = useWindowStore.subscribe((state, before) => {
      if (state.focusedId === before.focusedId && state.selectedWork === before.selectedWork) return;
      const hash = state.focusedId ? `#${state.focusedId}${state.focusedId === "works" && state.selectedWork ? "/" + state.selectedWork : ""}` : "";
      if (window.location.hash !== hash) window.history.replaceState(null, "", window.location.pathname + window.location.search + hash);
    });
    return () => { unsubscribe(); window.removeEventListener("hashchange", readHash); };
  }, []);
  useEffect(() => {
    if (!focusedId && previousFocus.current) {
      const id = previousFocus.current;
      const frame = requestAnimationFrame(() => (document.getElementById(mobile ? "mobile-home-focus" : `dock-${id}`) ?? document.getElementById("library-trigger"))?.focus());
      previousFocus.current = focusedId;
      return () => cancelAnimationFrame(frame);
    }
    previousFocus.current = focusedId;
  }, [focusedId, mobile]);
  if (entry === "pending") return <div className="intro-screen" aria-label="Opening Elisha Creatives" />;
  if (entry === "intro") return <Intro onComplete={finishIntro} />;
  return <AudioProvider><MotionConfig reducedMotion="user"><main className="os-shell desktop-arrival">
    <Wallpaper />
    <Link className="skip-link" href="/work">Skip to portfolio projects</Link>
    {!mobile && <>
      <MenuBar />
      <nav className="desktop-shortcuts" aria-label="Desktop shortcuts">
        {([{ id: "works", label: "Selected Work" }, { id: "about", label: "About Elisha" }, { id: "services", label: "Services" }, { id: "contact", label: "Contact" }] as const).map(shortcut => {
          const Icon = APPS.find(app => app.id === shortcut.id)!.icon;
          return <button key={shortcut.id} onClick={() => { if (shortcut.id === "works") useWindowStore.getState().selectWork(null, "Featured"); openApp(shortcut.id); }} aria-label={`Desktop: ${shortcut.label}`}><span className="shortcut-icon"><Icon className="h-7 w-7" /></span><span>{shortcut.label}</span></button>;
        })}
      </nav>
      <div className="desktop-caption"><p className="eyebrow">Elisha Creatives</p><p>Thoughtful identities. Useful websites.</p></div>
      <footer className="workspace-footer"><button onClick={() => openApp("help")}>New here? Take a quick tour ↗</button><Link href="/work">Browse project pages ↗</Link></footer>
      <Dock />
    </>}
    {mobile && !focusedId && <div id="mobile-home-focus" tabIndex={-1}><AppLibrary onOpenApp={openApp} /></div>}
    <div inert={libraryOpen}><WindowManager mobile={mobile} /></div>
    <AnimatePresence>{!mobile && libraryOpen && <div key="library" className="library-overlay" onClick={() => showLibrary(false)}><div onClick={e => e.stopPropagation()}><AppLibrary modal onOpenApp={openApp} onClose={() => showLibrary(false)} /></div></div>}</AnimatePresence>
  </main></MotionConfig></AudioProvider>;
}
