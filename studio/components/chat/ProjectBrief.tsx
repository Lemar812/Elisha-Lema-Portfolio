"use client";
import { BRIEF_KINDS, formatBrief, useProjectBriefStore } from "@/studio/store/projectBriefStore";
import { openStudioApp } from "@/studio/lib/navigation";
import { useAssistantUiStore } from "@/studio/store/assistantUiStore";

export default function ProjectBrief() {
  const { draft, step, update, setStep, prepare } = useProjectBriefStore();
  const ready = draft.business.trim().length >= 2 && draft.goal.trim().length >= 20;
  const field = "mt-2 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-[16px] text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-secondary";
  return <section className="mx-auto w-full max-w-xl p-5 text-text">
    <p className="text-xs uppercase tracking-widest text-text-secondary">Project brief · {step + 1} of 3</p>
    <h2 className="mt-3 text-2xl font-semibold tracking-tight">{["What are you planning?", "Give it some context.", "Ready for a conversation."][step]}</h2>
    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{["Choose a starting point. You can refine the details with Elisha.", "A few useful details are enough. Timing and budget are preferences, not commitments.", "Check your summary, then review it in Contact. Nothing is sent automatically."][step]}</p>
    {step === 0 && <div className="mt-6 grid grid-cols-1 gap-2">
      {BRIEF_KINDS.map((kind) => <button key={kind} aria-pressed={draft.kind === kind} onClick={() => update({ kind })} className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm ${draft.kind === kind ? "border-text bg-text text-bg" : "border-border bg-bg text-text"}`}>{kind}</button>)}
    </div>}
    {step === 1 && <div className="mt-5 space-y-4">
      <label className="block text-sm font-medium">Business or organisation
        <input className={field} maxLength={150} value={draft.business} onChange={(e) => update({ business: e.target.value })} placeholder="Your business or project name" autoComplete="organization" />
      </label>
      <label className="block text-sm font-medium">What should this project achieve?
        <textarea className={field} rows={3} maxLength={1800} value={draft.goal} onChange={(e) => update({ goal: e.target.value })} placeholder="For example: help travellers understand our tours and enquire." />
        <span className="mt-1 block text-xs font-normal text-text-secondary">At least 20 characters. Describe the outcome and any features you need.</span>
      </label>
      <label className="block text-sm font-medium">Who is it for? <span className="font-normal text-text-secondary">(optional)</span><input className={field} maxLength={300} value={draft.audience} onChange={(e) => update({ audience: e.target.value })} /></label>
      <label className="block text-sm font-medium">Preferred timing <span className="font-normal text-text-secondary">(optional)</span><input className={field} maxLength={150} value={draft.timing} onChange={(e) => update({ timing: e.target.value })} placeholder="A target date, or flexible" /></label>
      <label className="block text-sm font-medium">Budget preference <span className="font-normal text-text-secondary">(optional)</span><input className={field} maxLength={150} value={draft.budget} onChange={(e) => update({ budget: e.target.value })} placeholder="An amount and currency, or to discuss" /></label>
    </div>}
    {step === 2 && <p className="mt-5 whitespace-pre-wrap break-words rounded-xl border border-border bg-bg p-4 text-sm leading-7">{formatBrief(draft)}</p>}
    <div className="mt-6 flex flex-wrap gap-3">
      {step > 0 && <button className="min-h-11 rounded-lg border border-border px-4 text-sm" onClick={() => setStep(step - 1)}>Back</button>}
      {step < 2 ? <button className="min-h-11 rounded-lg bg-text px-4 text-sm font-medium text-bg disabled:opacity-40" disabled={step === 1 && !ready} onClick={() => setStep(step + 1)}>{step === 0 ? "Continue" : "Review brief"}</button> : <button className="min-h-11 rounded-lg bg-text px-4 text-sm font-medium text-bg" onClick={() => { prepare(); useAssistantUiStore.getState().closeAssistant(); openStudioApp("contact"); }}>Review in Contact</button>}
    </div>
    <p className="mt-5 text-xs leading-relaxed text-text-secondary">Your brief stays in this browser session until you choose to send an enquiry. Reloading clears this draft.</p>
  </section>;
}
