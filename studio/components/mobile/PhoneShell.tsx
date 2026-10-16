"use client";

/**
 * PhoneShell — root component for the iOS-style Elisha Creatives sibling.
 *
 * Renders inside a 100dvh viewport with the active wallpaper as backdrop.
 * Layer stack (bottom → top):
 *   1. Wallpaper (themeStore)
 *   2. HomeScreen — always mounted so swipes feel instant
 *   3. AppView    — animates over the home screen when an app is open
 *   4. LockScreen — overlays everything until unlocked
 *
 * The shared brand introduction unlocks the home screen on each reload.
 */

import { useEffect, useLayoutEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useMobileStore } from "@/studio/store/mobileStore";
import { useTheme } from "@/studio/store/themeStore";
import LockScreen from "./LockScreen";
import { Wallpaper } from "@/components/os/Wallpaper";
import { AnimatedBackground } from "@/studio/components/os/AnimatedBackground";
import HomeScreen from "./HomeScreen";
import AppView from "./AppView";
import AssistantSheet from "./AssistantSheet";
import type { AppType } from "@/studio/shared/types";

export default function PhoneShell() {
  const locked = useMobileStore((s) => s.locked);
  const openAppType = useMobileStore((s) => s.openAppType);
  const openApp = useMobileStore((s) => s.openApp);
  const syncLockWithSession = useMobileStore((s) => s.syncLockWithSession);
  const { wallpaper, mode } = useTheme();

  // The store's initial lock is read once at module load. If this tab booted
  // on the desktop and was then resized to mobile, skip the lock screen.
  // Layout effect so the stale lock screen never paints.
  useLayoutEffect(() => {
    syncLockWithSession();
  }, [syncLockWithSession]);

  // System back (Android gesture/button, browser back) closes the open app
  // instead of leaving the page. Pairs with the history.pushState wired up
  // inside mobileStore.openApp / closeApp.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPop = () => {
      const { openAppType, closeAppFromPopstate } = useMobileStore.getState();
      if (openAppType) closeAppFromPopstate();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleOpen = (appType: AppType) => openApp(appType);

  return (
    <div
      className={`ec-phone fixed inset-0 overflow-hidden ${mode === "dark" ? "dark" : ""}`}
      style={{ height: "100dvh" }}
    >
      {wallpaper?.id === "elisha-brand" ? (
        <Wallpaper />
      ) : (
        <AnimatedBackground />
      )}
      {/* Subtle darkening overlay so icons/labels remain legible across wallpapers */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      <div className="absolute inset-0" inert={!!openAppType || locked} aria-hidden={!!openAppType || locked}>
        <HomeScreen onOpenApp={handleOpen} />
      </div>

      <AppView />

      {/* Floating assistant — FAB + bottom sheet (self-hides while locked) */}
      <AssistantSheet />

      <AnimatePresence>{locked && <LockScreen />}</AnimatePresence>
    </div>
  );
}
