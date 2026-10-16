"use client";
import { useChatStore } from "@/studio/store/chatStore";
import { clampMessages, MAX_QUERY_LENGTH } from "./conciergeContext";
import { getGuideReply } from "./portfolioGuide";

// One request owner across the app and floating panel. Closing a view does not
// cancel another view's request or lose a seeded question.
let active: AbortController | null = null;
let generation = 0;
export function stopGuideResponse() {
  generation += 1;
  active?.abort();
  active = null;
  const s = useChatStore.getState();
  if (s.messages.at(-1)?.role === "assistant" && !s.messages.at(-1)?.content) s.dropLastAssistant();
  s.setStatus("idle");
  s.setResponseInfo(s.mode, "Response stopped. You can ask another question.");
}
export function newGuideConversation() {
  stopGuideResponse();
  useChatStore.getState().reset();
}
export async function sendGuideQuestion(raw: string, liveAI: boolean) {
  const question = raw.trim();
  const s = useChatStore.getState();
  if (!question || s.status !== "idle") return;
  if (question.length > MAX_QUERY_LENGTH) {
    s.setResponseInfo(s.mode, `Please keep your question under ${MAX_QUERY_LENGTH} characters.`);
    return;
  }
  const id = ++generation;
  s.addUser(question);
  s.setStatus("thinking");
  s.setResponseInfo(liveAI ? "ai" : "guide");
  const thread = clampMessages(useChatStore.getState().messages);
  const saved = () => {
    s.startAssistant();
    s.appendAssistant(getGuideReply(question, thread.slice(0, -1)).text);
    s.setStatus("idle");
  };
  if (!liveAI) { saved(); return; }
  const controller = new AbortController();
  active = controller;
  try {
    const response = await fetch("/api/concierge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: thread }), signal: controller.signal });
    if (!response.ok || !response.body) throw new Error("Live response unavailable");
    if (id !== generation) return;
    s.setResponseInfo(response.headers.get("X-Guide-Mode") === "saved" ? "guide" : "ai");
    s.startAssistant();
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (id !== generation) { await reader.cancel(); return; }
      if (done) break;
      s.appendAssistant(decoder.decode(value, { stream: true }));
    }
    s.appendAssistant(decoder.decode());
    if (!useChatStore.getState().messages.at(-1)?.content.trim()) throw new Error("Empty response");
    s.setStatus("idle");
  } catch {
    if (id !== generation) return;
    if (useChatStore.getState().messages.at(-1)?.role === "assistant") s.dropLastAssistant();
    s.setResponseInfo("guide", "Live AI is unavailable. The portfolio guide is helping with verified information instead.");
    saved();
  } finally {
    if (id === generation) active = null;
  }
}
