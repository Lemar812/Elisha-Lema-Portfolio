"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/studio/store/analyticsStore";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = set by the Vercel PostHog integration (production)
      // NEXT_PUBLIC_POSTHOG_KEY           = legacy name used in .env.local (local dev)
      // Fall back through both so neither environment breaks.
      const key =
        process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
        process.env.NEXT_PUBLIC_POSTHOG_KEY ||
        "";
      if (!key) return; // no key configured — skip init silently

      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        respect_dnt: true,
        opt_out_capturing_by_default: useAnalyticsStore.getState().isOptedOut,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
      });
      return useAnalyticsStore.subscribe((state, previous) => {
        if (state.isOptedOut === previous.isOptedOut) return;
        if (state.isOptedOut) posthog.opt_out_capturing();
        else posthog.opt_in_capturing();
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
