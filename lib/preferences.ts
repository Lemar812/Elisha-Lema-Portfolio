"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type WallpaperStyle = "signature" | "grid" | "plain";
export const usePreferences = create(persist<{
  wallpaper: WallpaperStyle; motion: boolean; sounds: boolean; volume: number;
  setWallpaper: (value: WallpaperStyle) => void; setMotion: (value: boolean) => void;
  setSounds: (value: boolean) => void; setVolume: (value: number) => void;
}>(set => ({
  wallpaper: "signature", motion: true, sounds: false, volume: .18,
  setWallpaper: wallpaper => set({ wallpaper }), setMotion: motion => set({ motion }),
  setSounds: sounds => set({ sounds }), setVolume: volume => set({ volume }),
}), { name: "elisha-preferences-v1", skipHydration: true }));
