import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Wallpaper {
  id: string;
  name: string;
  type: "static" | "gradient" | "animated";
  theme: "light" | "dark" | "both";
  thumbnail?: string;
  imageUrl?: string;
  gradientConfig?: {
    colors: string[];
    angle: number;
  };
  animatedConfig?: {
    colors: string[];
    speed: number;
    pattern: "mesh" | "radial" | "wave" | "particles" | "starfield" | "grid";
  };
}

export type Palette = "mono" | "color";

interface ThemeStore {
  // State
  mode: "light" | "dark";
  palette: Palette;
  accentColor: string;
  wallpaper: Wallpaper | null;
  wallpaperTint: string | null;

  // Actions
  toggleMode: () => void;
  setMode: (mode: "light" | "dark") => void;
  setPalette: (palette: Palette) => void;
  setAccent: (color: string) => void;
  setWallpaper: (wallpaper: Wallpaper) => void;
  setWallpaperTint: (color: string) => void;
}

export const BRAND_WALLPAPER: Wallpaper = {
  id: "elisha-brand",
  name: "Elisha Creatives",
  type: "static",
  theme: "both",
  imageUrl: "/media/elisha-reveal-still.jpg",
  thumbnail: "/media/elisha-reveal-still.jpg",
};

// Default wallpapers
export const DEFAULT_WALLPAPERS: Wallpaper[] = [
  {
    id: "gradient-mesh-light",
    name: "Gradient Flow",
    type: "animated",
    theme: "light",
    animatedConfig: {
      colors: ["#667eea", "#764ba2", "#f093fb"],
      speed: 15,
      pattern: "mesh",
    },
  },
  {
    id: "gradient-mesh-dark",
    name: "Dark Matter",
    type: "animated",
    theme: "dark",
    animatedConfig: {
      colors: ["#0f2027", "#203a43", "#2c5364"],
      speed: 20,
      pattern: "mesh",
    },
  },
];

// Preset accent colors (iOS-style)
export const ACCENT_COLORS = {
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  orange: "#FF9500",
  green: "#34C759",
  teal: "#5AC8FA",
  red: "#FF3B30",
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // Initial state
      mode: "dark",
      // Premium black & white is the default; "Fun" (color) is opt-in.
      palette: "mono",
      accentColor: ACCENT_COLORS.blue,
      wallpaper: BRAND_WALLPAPER,
      wallpaperTint: null,

      // Actions
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "dark" ? "light" : "dark" })),
      setMode: (mode) => set({ mode }),

      setPalette: (palette) => set({ palette }),

      setAccent: (color) => set({ accentColor: color }),

      setWallpaper: (wallpaper) => set({ wallpaper }),

      setWallpaperTint: (color) => set({ wallpaperTint: color }),
    }),
    {
      name: "elisha-studio-theme", // localStorage key
      version: 1,
      // Adopt the brand desktop once; subsequent visitor choices still persist.
      migrate: (persisted) => ({
        ...(persisted as Partial<ThemeStore>),
        wallpaper: BRAND_WALLPAPER,
        wallpaperTint: null,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<ThemeStore>;
        const wallpaper = saved.wallpaper ?? current.wallpaper;
        return {
          ...current,
          ...saved,
          wallpaper:
            wallpaper?.id === "elisha-brand"
              ? { ...wallpaper, imageUrl: "/media/elisha-reveal-still.jpg" }
              : wallpaper,
        };
      },
    },
  ),
);

// Hook for easier access
export const useTheme = () => {
  const store = useThemeStore();
  return {
    mode: store.mode,
    palette: store.palette,
    accentColor: store.accentColor,
    wallpaper: store.wallpaper,
    wallpaperTint: store.wallpaperTint,
    toggleMode: store.toggleMode,
    setMode: store.setMode,
    setPalette: store.setPalette,
    setAccent: store.setAccent,
    setWallpaper: store.setWallpaper,
    setWallpaperTint: store.setWallpaperTint,
  };
};
