"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type WallpaperStyle = "signature" | "grid" | "plain";
interface Preferences {
  wallpaper: WallpaperStyle;
  motion: boolean;
  sounds: boolean;
  volume: number;
  masterMuted: boolean;
  musicEnabled: boolean;
  effectsVolume: number;
  setWallpaper: (value: WallpaperStyle) => void;
  setMotion: (value: boolean) => void;
  setSounds: (value: boolean) => void;
  setVolume: (value: number) => void;
}
export const usePreferences = create(
  persist<Preferences>(
    (set) => ({
      wallpaper: "signature",
      motion: true,
      sounds: false,
      volume: 0.18,
      masterMuted: false,
      musicEnabled: true,
      effectsVolume: 0.8,
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setMotion: (motion) => set({ motion }),
      setSounds: (sounds) => set({ sounds }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "elisha-preferences-v1",
      skipHydration: true,
      version: 1,
      migrate: (persisted) => ({
        ...(persisted as Preferences),
        wallpaper: "signature" as const,
      }),
    },
  ),
);
