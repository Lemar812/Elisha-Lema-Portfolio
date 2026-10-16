"use client";

/**
 * HomeScreen — paged home screen with sticky dock.
 *
 * Uses CSS scroll-snap for the horizontal page swipe (perf-friendly, no
 * Framer here per the plan's perf budget). A scroll listener keeps
 * mobileStore.currentPage in sync for PageDots.
 */

import { useEffect, useRef } from "react";
import { useMobileStore } from "@/studio/store/mobileStore";
import { getHomePages } from "@/studio/lib/mobileAppRegistry";
import HomePage from "./HomePage";
import AppLibraryPage from "./AppLibraryPage";
import PageDots from "./PageDots";
import Dock from "./Dock";
import StatusBar from "./StatusBar";
import type { AppType } from "@/studio/shared/types";

interface HomeScreenProps {
  onOpenApp: (appType: AppType) => void;
}

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  const pages = getHomePages();
  const currentPage = useMobileStore((s) => s.currentPage);
  const setPage = useMobileStore((s) => s.setPage);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Keep the selected page aligned after remounts or orientation changes.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let width = -1;
    const align = () => {
      if (!el.clientWidth || el.clientWidth === width) return;
      width = el.clientWidth;
      el.scrollTo({ left: useMobileStore.getState().currentPage * width, behavior: "instant" });
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync scroll position → store
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!el.clientWidth) return;
      const page = Math.round(el.scrollLeft / el.clientWidth);
      if (page !== currentPage) setPage(page);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [currentPage, setPage]);

  return (
    <div className="absolute inset-0 flex flex-col text-white">
      {/* Status bar */}
      <div className="pt-safe flex-shrink-0 relative z-10">
        <StatusBar />
      </div>

      <div className="ec-phone-brand">
        <span>Elisha Creatives</span>
      </div>
      {/* Pages */}
      <div
        ref={scrollerRef}
        className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar"
      >
        {pages.map((page, i) => (
          <HomePage key={i} apps={page} onOpen={onOpenApp} active={currentPage === i} />
        ))}
        {/* App Library — the last page. Swipe past the final home page to reach
            the flat all-apps grid + consolidated search. Reports its index as
            pages.length to the scroll listener above. */}
        <AppLibraryPage active={currentPage === pages.length} />
      </div>

      {/* Page dots — one per home page, plus a trailing search glyph standing in
          for the App Library page (active when currentPage === pages.length). */}
      <div className="flex-shrink-0 py-2">
        <PageDots
          count={pages.length}
          active={currentPage}
          showLibrary
          onNavigate={(page) => {
            const element = scrollerRef.current;
            element?.scrollTo({
              left: page * element.clientWidth,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
            });
          }}
        />
      </div>

      {/* Dock */}
      <div className="flex-shrink-0 pb-safe">
        <Dock onOpen={onOpenApp} />
      </div>
    </div>
  );
}
