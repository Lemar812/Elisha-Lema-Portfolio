"use client";
import { create } from "zustand";
export const APP_IDS = ["about", "works", "resume", "contact", "services", "testimonials", "welcome", "help", "preferences"] as const;
export type AppId = (typeof APP_IDS)[number];
export type Position = { x: number; y: number };
export interface WindowEntry {
  isOpen: boolean; isMinimized: boolean; isMaximized: boolean; zIndex: number; position: Position;
}
interface WindowStoreState {
  windows: Record<AppId, WindowEntry>; focusedId: AppId | null; topZ: number; libraryOpen: boolean;
  selectedWork: string | null; workCategory: string;
  openApp: (id: AppId) => void; closeApp: (id: AppId) => void; minimizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void; toggleApp: (id: AppId) => void; toggleMaximize: (id: AppId) => void;
  moveApp: (id: AppId, position: Position) => void; showLibrary: (open: boolean) => void;
  showDesktop: () => void; selectWork: (id: string | null, category?: string) => void;
}
const initialWindows = Object.fromEntries(APP_IDS.map((id, i) => [id, {
  isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0,
  position: { x: id === "welcome" ? 170 : 120 + i * 18, y: id === "welcome" ? 30 : 24 + i * 20 },
}])) as Record<AppId, WindowEntry>;
function nextFocus(windows: Record<AppId, WindowEntry>): AppId | null {
  return APP_IDS.filter(id => windows[id].isOpen && !windows[id].isMinimized)
    .sort((a, b) => windows[b].zIndex - windows[a].zIndex)[0] ?? null;
}
export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: initialWindows, focusedId: null, topZ: 0, libraryOpen: false, selectedWork: null, workCategory: "Featured",
  openApp: id => set(state => ({
    windows: { ...state.windows, [id]: { ...state.windows[id], isOpen: true, isMinimized: false, zIndex: state.topZ + 1 } },
    focusedId: id, topZ: state.topZ + 1, libraryOpen: false,
  })),
  focusApp: id => { if (get().focusedId !== id || get().windows[id].isMinimized) get().openApp(id); },
  closeApp: id => set(state => {
    const windows = { ...state.windows, [id]: { ...state.windows[id], isOpen: false, isMinimized: false } };
    return { windows, focusedId: state.focusedId === id ? nextFocus(windows) : state.focusedId };
  }),
  minimizeApp: id => set(state => {
    const windows = { ...state.windows, [id]: { ...state.windows[id], isMinimized: true } };
    return { windows, focusedId: state.focusedId === id ? nextFocus(windows) : state.focusedId };
  }),
  toggleApp: id => {
    const state = get();
    if (state.focusedId === id && !state.windows[id].isMinimized) state.minimizeApp(id);
    else state.openApp(id);
  },
  toggleMaximize: id => set(state => ({ windows: { ...state.windows, [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized } } })),
  moveApp: (id, position) => set(state => ({ windows: { ...state.windows, [id]: { ...state.windows[id], position } } })),
  showLibrary: libraryOpen => set({ libraryOpen }),
  showDesktop: () => set(state => ({
    windows: Object.fromEntries(APP_IDS.map(id => [id, { ...state.windows[id], isMinimized: state.windows[id].isOpen }])) as Record<AppId, WindowEntry>,
    focusedId: null, libraryOpen: false,
  })),
  selectWork: (selectedWork, workCategory) => set(state => ({ selectedWork, workCategory: workCategory ?? state.workCategory })),
}));
