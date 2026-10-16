"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowUpRight, X, Square, RotateCcw } from "lucide-react";
import { useChatStore } from "@/studio/store/chatStore";
import { MAX_QUERY_LENGTH } from "@/studio/lib/conciergeContext";
import { getGuideReply, type GuideAction } from "@/studio/lib/portfolioGuide";
import { sendGuideQuestion, stopGuideResponse, newGuideConversation } from "@/studio/lib/chatSession";
import { openStudioApp } from "@/studio/lib/navigation";
import { useAssistantUiStore } from "@/studio/store/assistantUiStore";
import { works } from "@/data/works";
import ProjectBrief from "./ProjectBrief";
import "./chat.css";

const starters = [
  { title: "Find relevant work", detail: "Explore real projects and design decisions.", question: "Find relevant work", brief: false },
  { title: "Choose a service", detail: "Find the right starting point for your business.", question: "Which service fits my project?", brief: false },
  { title: "Plan a project", detail: "Turn your idea into a brief for Elisha.", question: "", brief: true },
  { title: "Meet Elisha", detail: "Get to know the person behind the work.", question: "Meet Elisha", brief: false },
];
export default function ChatPanel({ onClose, autoFocusComposer = true, showHeader = true }: { onClose?: () => void; autoFocusComposer?: boolean; showHeader?: boolean }) {
  const { messages, status, seed, view, setView, notice, mode } = useChatStore();
  const [input, setInput] = useState("");
  const [liveAI, setLiveAI] = useState(false);
  const composer = useRef<HTMLTextAreaElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const latestReply = useRef<HTMLElement>(null);
  const displayedReply = useRef<string | null>(null);
  const busy = status !== "idle";
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/studio-status", { signal: controller.signal }).then((r) => r.json()).then((data) => setLiveAI(!!data.ai)).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const pending = useChatStore.getState().seed;
    if (!pending || useChatStore.getState().status !== "idle") return;
    useChatStore.getState().setSeed(null);
    useChatStore.getState().setView("chat");
    stickToBottom.current = true;
    void sendGuideQuestion(pending, liveAI);
  }, [seed, status, liveAI]);
  useEffect(() => { if (autoFocusComposer && view === "chat") composer.current?.focus(); }, [autoFocusComposer, view]);
  useEffect(() => {
    const container = thread.current;
    if (!container) return;
    if (!messages.length) {
      container.scrollTop = 0;
      displayedReply.current = null;
      return;
    }
    const reply = messages.at(-1);
    const replyKey = reply?.role === "assistant" ? `${messages.length}:${reply.content}` : null;
    if (status === "idle" && replyKey && replyKey !== displayedReply.current && latestReply.current) {
      container.scrollTop += latestReply.current.getBoundingClientRect().top - container.getBoundingClientRect().top - 16;
      displayedReply.current = replyKey;
      stickToBottom.current = false;
    } else if (status !== "idle" && stickToBottom.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, status, view]);
  const send = (text: string) => {
    if (!text.trim() || busy) return;
    stickToBottom.current = true;
    setInput("");
    void sendGuideQuestion(text, liveAI);
  };
  const open = (action: GuideAction) => {
    useAssistantUiStore.getState().closeAssistant();
    openStudioApp(action.app, action.workId);
  };
  const lastUserIndex = messages.findLastIndex((m) => m.role === "user");
  const suggestions = lastUserIndex >= 0 ? getGuideReply(messages[lastUserIndex].content, messages.slice(0, lastUserIndex)) : null;
  const actionClass = "min-h-10 rounded-lg border border-border bg-bg px-3 py-2 text-left text-xs text-text hover:border-text-secondary focus-visible:outline-2 focus-visible:outline-text-secondary disabled:opacity-40";
  return <div className="ec-guide flex h-full min-h-0 w-full flex-col overflow-hidden bg-surface text-text">
    {showHeader && <header className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Elisha Creatives <span className="ml-1 text-xs font-normal text-text-secondary">/ Guide</span></p><p className="mt-1 text-xs text-text-secondary">{busy ? "Preparing your answer…" : mode === "ai" ? "AI-assisted portfolio guidance" : "Work, services & project planning"}</p></div>
      {!!messages.length && <button title="New conversation" aria-label="New conversation" disabled={busy} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-bg disabled:opacity-40" onClick={() => { newGuideConversation(); setInput(""); }}><RotateCcw size={16} /></button>}
      {onClose && <button aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-bg" onClick={onClose}><X size={18} /></button>}
    </header>}
    <nav aria-label="Guide sections" className="flex shrink-0 gap-1 border-b border-border p-2">
      {(["chat", "brief"] as const).map((tab) => <button key={tab} aria-pressed={view === tab} className={"min-h-10 flex-1 rounded-lg px-3 text-sm " + (view === tab ? "bg-text text-bg" : "text-text-secondary hover:bg-bg")} onClick={() => setView(tab)}>{tab === "chat" ? "Conversation" : "Project brief"}</button>)}
    </nav>
    {view === "brief" ? <div className="min-h-0 flex-1 overflow-auto"><ProjectBrief /></div> : <>
      <div ref={thread} aria-label="Guide conversation" className="ec-guide-thread min-h-0 flex-1 overflow-auto overscroll-contain" onScroll={() => { const el = thread.current; if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90; }}>
        {!messages.length ? <section className="ec-guide-welcome mx-auto max-w-xl px-5 py-6">
          <p className="text-[10px] uppercase tracking-[.2em] text-text-secondary">A useful place to start</p>
          <h2 className="mt-3 text-[25px] font-semibold leading-tight tracking-tight">What would you like to create?</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">I can connect your idea with Elisha’s work, help you choose a service, or prepare a clear project brief.</p>
          <div className="ec-guide-starters mt-5 grid gap-2">{starters.map((s) => <button key={s.title} onClick={() => s.brief ? setView("brief") : send(s.question)} className="group flex min-h-16 items-center gap-3 rounded-xl border border-border bg-bg p-3 text-left hover:border-text-secondary">
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{s.title}</span><span className="mt-1 block text-xs leading-relaxed text-text-secondary">{s.detail}</span></span><ArrowUpRight size={16} className="shrink-0" />
          </button>)}</div>
          <p className="mt-4 text-xs leading-relaxed text-text-secondary">An automated portfolio guide, not Elisha personally. Prices and availability are confirmed directly with him.</p>
        </section> : <div className="mx-auto max-w-2xl space-y-5 px-4 py-5">
          {messages.map((message, index) => <article ref={index === messages.length - 1 && message.role === "assistant" ? latestReply : undefined} key={index} className={message.role === "user" ? "ml-6 rounded-xl border border-border bg-bg p-3" : "pr-2"}>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-text-secondary">{message.role === "user" ? "You" : "Portfolio guide"}</p>
            <p className="whitespace-pre-wrap break-words text-sm leading-7">{message.content || (busy ? "Preparing your answer…" : "Response stopped.")}</p>
          </article>)}
          {!busy && messages.at(-1)?.role === "assistant" && suggestions && <section aria-label="Suggested next steps" className="space-y-4 border-t border-border pt-4">
            {!!suggestions.projects.length && <div className="grid gap-2">{suggestions.projects.map((id) => { const work = works.find((w) => w.id === id); return work && <button key={id} onClick={() => open({ app: "projects", workId: id, label: work.title })} className="flex items-center gap-3 rounded-xl border border-border bg-bg p-2 text-left hover:border-text-secondary">
              <Image src={work.imageSrc} alt="" width={60} height={60} className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain" /><span className="min-w-0 flex-1"><span className="block text-xs text-text-secondary">{work.category}</span><span className="mt-1 block text-sm font-medium">{work.title}</span></span><ArrowUpRight size={16} className="shrink-0" />
            </button>; })}</div>}
            {!!suggestions.actions.length && <div className="flex flex-wrap gap-2">{suggestions.actions.map((action) => <button className={actionClass} key={action.label} onClick={() => open(action)}>{action.label} ↗</button>)}</div>}
            <div><p className="mb-2 text-xs text-text-secondary">Continue exploring</p><div className="flex flex-wrap gap-2">{suggestions.followUps.map((q) => <button key={q} className={actionClass} onClick={() => send(q)}>{q}</button>)}</div></div>
          </section>}
        </div>}
      </div>
      <div className="ec-guide-composer shrink-0 border-t border-border px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2">
        <p role="status" aria-live="polite" className="mb-2 text-xs text-text-secondary">{notice || (busy ? "Preparing a response. You can stop it below." : "Ask about the work, services or Elisha’s story.")}</p>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 rounded-xl border border-border bg-bg p-2 focus-within:border-text-secondary">
          <textarea ref={composer} aria-label="Ask the portfolio guide" placeholder="What do you have in mind?" maxLength={MAX_QUERY_LENGTH} value={input} rows={2} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(input); } }} className="min-w-0 flex-1 resize-none bg-transparent p-1 text-[16px] leading-6 outline-none placeholder:text-text-secondary" />
          {busy ? <button type="button" aria-label="Stop response" onClick={stopGuideResponse} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-text text-bg"><Square size={16} /></button> : <button type="submit" aria-label="Send" disabled={!input.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-text text-bg disabled:opacity-35"><ArrowUp size={18} /></button>}
        </form>
      </div>
    </>}
  </div>;
}
