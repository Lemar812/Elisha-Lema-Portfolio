"use client";
import { useOSStore } from "@/studio/store/osStore";
import { useMobileStore } from "@/studio/store/mobileStore";
import { create } from "zustand";
import type { AppType } from "@/studio/shared/types";
export const useCreativeSelection = create<{
  id: string | null;
  select: (id: string | null) => void;
}>((set) => ({ id: null, select: (id) => set({ id }) }));
export function openStudioApp(app: AppType, workId?: string) {
  if (app === "projects")
    useCreativeSelection.getState().select(workId ?? null);
  if (typeof window !== "undefined" && window.innerWidth < 768)
    useMobileStore.getState().openApp(app);
  else useOSStore.getState().openWindow(app);
}
