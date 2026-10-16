import { create } from "zustand";
import type { ChatMessage } from "@/studio/lib/conciergeContext";

/**
 * Conversation state for the Chat app. Session-only (not persisted to
 * localStorage): the thread survives closing/reopening the window within a
 * session, but a page reload starts fresh.
 */
export type ChatStatus = "idle" | "thinking" | "streaming";

interface ChatStore {
  messages: ChatMessage[];
  status: ChatStatus;
  /** A question handed off from Spotlight / Terminal, consumed on mount. */
  seed: string | null;
  view: "chat" | "brief";
  setView: (view: "chat" | "brief") => void;
  mode: "guide" | "ai";
  notice: string;
  setResponseInfo: (mode: "guide" | "ai", notice?: string) => void;

  setStatus: (status: ChatStatus) => void;
  addUser: (content: string) => void;
  /** Push an empty assistant turn to stream deltas into. */
  startAssistant: () => void;
  appendAssistant: (delta: string) => void;
  /** Drop the trailing assistant turn (used to undo a placeholder on error). */
  dropLastAssistant: () => void;
  setSeed: (q: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  status: "idle",
  seed: null,
  view: "chat",
  setView: (view) => set({ view }),
  mode: "guide",
  notice: "",
  setResponseInfo: (mode, notice = "") => set({ mode, notice }),

  setStatus: (status) => set({ status }),

  addUser: (content) =>
    set((s) => ({ messages: [...s.messages, { role: "user", content }].slice(-40) as ChatMessage[] })),

  startAssistant: () =>
    set((s) => ({
      messages: [...s.messages, { role: "assistant", content: "" }],
      status: "streaming",
    })),

  appendAssistant: (delta) =>
    set((s) => {
      const messages = s.messages.slice();
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        if (messages[i].role === "assistant") {
          messages[i] = {
            ...messages[i],
            content: messages[i].content + delta,
          };
          break;
        }
      }
      return { messages };
    }),

  dropLastAssistant: () =>
    set((s) => {
      const messages = s.messages.slice();
      if (
        messages.length &&
        messages[messages.length - 1].role === "assistant"
      ) {
        messages.pop();
      }
      return { messages };
    }),

  setSeed: (seed) => set({ seed }),

  reset: () => set({ messages: [], status: "idle", seed: null, view: "chat", notice: "", mode: "guide" }),
}));
