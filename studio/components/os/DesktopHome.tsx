"use client";
import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Link from "next/link";
import { Intro } from "@/components/os/Intro";
import { AudioProvider } from "@/components/os/AudioProvider";
import { ThemeProvider } from "@/studio/components/providers/ThemeProvider";
import { PostHogProvider } from "@/studio/components/providers/PostHogProvider";
import { useOSStore } from "@/studio/store/osStore";
import { markBootedThisSession } from "@/studio/lib/bootSession";
import { useMobileStore } from "@/studio/store/mobileStore";
import { openStudioApp } from "@/studio/lib/navigation";
import { appRegistry } from "@/studio/lib/appRegistry";
import type { AppType } from "@/studio/shared/types";
import Desktop from "./Desktop";
import WindowManager from "./WindowManager";
import StageManager from "./StageManager";
import NotificationCenter from "./NotificationCenter";
import { DesktopWidgets } from "@/studio/components/widgets/DesktopWidgets";
import PhoneShell from "@/studio/components/mobile/PhoneShell";
import Spotlight from "./Spotlight";
import AppSwitcher from "./AppSwitcher";
import AssistantBubble from "@/studio/components/assistant/AssistantBubble";
export default function DesktopHome() {
  const [ready, setReady] = useState(false);
  const [booted, setBooted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const finish = useCallback(() => {
    markBootedThisSession();
    useOSStore.getState().setBooted();
    useMobileStore.getState().unlock();
    setBooted(true);
  }, []);
  useEffect(() => {
    const check = () => {
      setMobile(window.innerWidth < 768);
      useOSStore
        .getState()
        .fitToViewport(window.innerWidth, window.innerHeight);
    };
    check();
    setReady(true);
    window.addEventListener("resize", check);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    return () => window.removeEventListener("resize", check);
  }, [finish]);
  useEffect(() => {
    if (!booted) return;
    const route = () => {
      const [raw, id] = window.location.hash.slice(1).split("/");
      const aliases: Record<string, AppType> = {
        about: "about-me",
        works: "projects",
        preferences: "display-options",
      };
      const app = aliases[raw] ?? (raw as AppType);
      if (appRegistry[app]) openStudioApp(app, id);
    };
    route();
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, [booted]);
  if (!ready)
    return (
      <div className="intro-screen" aria-label="Opening Elisha Creatives" />
    );
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        {!booted ? (
          <Intro onComplete={finish} />
        ) : (
          <PostHogProvider>
            <AudioProvider>
              <main className="ec-studio">
                <Link className="skip-link" href="/work">
                  Skip to portfolio projects
                </Link>
                {mobile ? (
                  <PhoneShell />
                ) : (
                  <Desktop>
                    <StageManager />
                    <WindowManager />
                    <NotificationCenter />
                    <DesktopWidgets />
                    <Spotlight />
                    <AppSwitcher />
                    <AssistantBubble />
                  </Desktop>
                )}
                <Toaster position="top-right" />
              </main>
            </AudioProvider>
          </PostHogProvider>
        )}
      </MotionConfig>
    </ThemeProvider>
  );
}
