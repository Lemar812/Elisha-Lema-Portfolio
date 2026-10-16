import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appRegistry, getAppLabel } from "@/studio/lib/appRegistry";
import type { WindowState, AppType } from "@/studio/shared/types";

interface OSStore {
  // Boot
  isBooted: boolean;
  setBooted: () => void;

  // Window Management
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  windowCounter: number;

  // Window Actions
  openWindow: (appType: AppType, customProps?: Partial<WindowState>) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  updateWindowPosition: (
    windowId: string,
    position: { x: number; y: number },
  ) => void;
  updateWindowSize: (
    windowId: string,
    size: { width: number; height: number },
  ) => void;
  fitToViewport: (width: number, height: number) => void;
  snapWindow: (
    windowId: string,
    bounds: { x: number; y: number; width: number; height: number },
  ) => void;
}

export const useOSStore = create<OSStore>()(
  persist(
    (set, get) => ({
      // Boot
      isBooted: false,
      setBooted: () => set({ isBooted: true }),

      // Initial State
      windows: [],
      activeWindowId: null,
      nextZIndex: 1000,
      windowCounter: 1,

      // Window Actions — reads defaults from appRegistry
      openWindow: (appType: AppType, customProps = {}) => {
        const existingWindow = get().windows.find(
          (w) => w.appType === appType && w.isOpen,
        );

        if (existingWindow) {
          get().focusWindow(existingWindow.id);
          return;
        }

        const reg = appRegistry[appType];
        const label = getAppLabel(appType);
        const windowId = `${appType}-${get().windowCounter}`;
        const currentZIndex = get().nextZIndex;

        const newWindow: WindowState = {
          id: windowId,
          title: label.windowTitle,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          position: reg?.defaultPosition ?? { x: 100, y: 100 },
          size: reg?.defaultSize ?? { width: 600, height: 400 },
          zIndex: currentZIndex,
          appType,
          ...customProps,
        };

        if (typeof window !== "undefined") {
          newWindow.size = {
            width: Math.min(newWindow.size.width, window.innerWidth - 40),
            height: Math.min(newWindow.size.height, window.innerHeight - 116),
          };
          newWindow.position = {
            x: Math.max(
              20,
              Math.min(
                newWindow.position.x,
                window.innerWidth - newWindow.size.width - 20,
              ),
            ),
            y: Math.max(
              36,
              Math.min(
                newWindow.position.y,
                window.innerHeight - newWindow.size.height - 80,
              ),
            ),
          };
        }
        set((state) => ({
          windows: [...state.windows, newWindow],
          activeWindowId: windowId,
          nextZIndex: currentZIndex + 1,
          windowCounter: state.windowCounter + 1,
        }));
      },

      closeWindow: (windowId: string) => {
        set((state) => {
          const remainingWindows = state.windows.filter(
            (w) => w.id !== windowId,
          );
          const newActiveId =
            remainingWindows
              .filter((w) => w.isOpen && !w.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;

          return {
            windows: remainingWindows,
            activeWindowId: newActiveId,
          };
        });
      },

      focusWindow: (windowId: string) => {
        const currentZIndex = get().nextZIndex;

        set((state) => ({
          windows: state.windows.map((window) =>
            window.id === windowId
              ? { ...window, zIndex: currentZIndex, isMinimized: false }
              : window,
          ),
          activeWindowId: windowId,
          nextZIndex: currentZIndex + 1,
        }));
      },

      minimizeWindow: (windowId: string) => {
        set((state) => {
          const windows = state.windows.map((window) =>
            window.id === windowId ? { ...window, isMinimized: true } : window,
          );
          return {
            windows,
            activeWindowId:
              state.activeWindowId === windowId
                ? (windows
                    .filter((w) => w.isOpen && !w.isMinimized)
                    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null)
                : state.activeWindowId,
          };
        });
      },

      fitToViewport: (width, height) => {
        if (width < 768) return;
        set((state) => ({
          windows: state.windows.map((w) => ({
            ...w,
            title: getAppLabel(w.appType).windowTitle,
            size: {
              width: Math.min(w.size.width, width - 40),
              height: Math.min(w.size.height, height - 68),
            },
            // Keep the title bar reachable while allowing windows behind the dock.
            position: {
              x: Math.max(
                100 - Math.min(w.size.width, width - 40),
                Math.min(w.position.x, width - 100),
              ),
              y: Math.max(28, Math.min(w.position.y, height - 80)),
            },
          })),
        }));
      },

      maximizeWindow: (windowId: string) => {
        set((state) => ({
          windows: state.windows.map((window) =>
            window.id === windowId
              ? { ...window, isMaximized: !window.isMaximized }
              : window,
          ),
        }));
      },

      updateWindowPosition: (
        windowId: string,
        position: { x: number; y: number },
      ) => {
        set((state) => ({
          windows: state.windows.map((window) =>
            window.id === windowId ? { ...window, position } : window,
          ),
        }));
      },

      updateWindowSize: (
        windowId: string,
        size: { width: number; height: number },
      ) => {
        set((state) => ({
          windows: state.windows.map((window) =>
            window.id === windowId ? { ...window, size } : window,
          ),
        }));
      },

      // Snap a window to a computed half/quarter region and bring it to front.
      snapWindow: (windowId, bounds) => {
        const currentZIndex = get().nextZIndex;
        set((state) => ({
          windows: state.windows.map((window) =>
            window.id === windowId
              ? {
                  ...window,
                  position: { x: bounds.x, y: bounds.y },
                  size: { width: bounds.width, height: bounds.height },
                  isMaximized: false,
                  zIndex: currentZIndex,
                }
              : window,
          ),
          activeWindowId: windowId,
          nextZIndex: currentZIndex + 1,
        }));
      },
    }),
    {
      name: "elisha-studio-windows", // localStorage key — session layout persistence
      storage: createJSONStorage(() => {
        try {
          if (typeof window !== "undefined") return window.localStorage;
        } catch {
          /* Layout can remain session-only. */
        }
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
      // Bump when the persisted shape changes; older blobs are discarded rather
      // than restored, so a stale layout can never crash a new build.
      version: 1,
      // Discard pre-v1 layouts cleanly (no noisy migrate warning, no restore).
      migrate: () => ({
        windows: [],
        activeWindowId: null,
        nextZIndex: 1000,
        windowCounter: 1,
      }),
      // Replay the brand introduction on every reload; restore only layout.
      partialize: (state) => ({
        windows: state.windows,
        activeWindowId: state.activeWindowId,
        nextZIndex: state.nextZIndex,
        windowCounter: state.windowCounter,
      }),
      // Defensive rehydration: validate every restored window and fail safe.
      // A malformed or stale persisted blob must never throw during boot or
      // hand a broken WindowState to an app. On any doubt, restore nothing.
      merge: (persisted, current) => {
        try {
          const p = (persisted ?? {}) as Partial<OSStore>;
          const windows = Array.isArray(p.windows)
            ? p.windows.filter(
                (w): w is WindowState =>
                  !!w &&
                  typeof w.id === "string" &&
                  typeof w.appType === "string" &&
                  !!appRegistry[w.appType as AppType] &&
                  !!w.position &&
                  Number.isFinite(w.position.x) &&
                  Number.isFinite(w.position.y) &&
                  !!w.size &&
                  Number.isFinite(w.size.width) &&
                  w.size.width > 0 &&
                  Number.isFinite(w.size.height) &&
                  w.size.height > 0,
              )
            : [];
          return { ...current, ...p, windows, isBooted: false };
        } catch {
          // Corrupt persisted state: ignore it, boot clean.
          return { ...current, isBooted: false };
        }
      },
    },
  ),
);
