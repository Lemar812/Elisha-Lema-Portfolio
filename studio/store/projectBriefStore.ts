import { create } from "zustand";
export const BRIEF_KINDS = ["Website", "Brand identity", "Promotional design", "Design + website"] as const;
export type ProjectBrief = { kind: string; business: string; goal: string; audience: string; timing: string; budget: string };
export const emptyBrief: ProjectBrief = { kind: "Website", business: "", goal: "", audience: "", timing: "", budget: "" };
export function formatBrief(b: ProjectBrief) {
  return `Project: ${b.kind}\nBusiness / organisation: ${b.business.trim()}\nGoal: ${b.goal.trim()}\nAudience: ${b.audience.trim() || "To discuss"}\nPreferred timing: ${b.timing.trim() || "To discuss"}\nBudget preference: ${b.budget.trim() || "To discuss"}`;
}
export const useProjectBriefStore = create<{
  draft: ProjectBrief; step: number; pending: { subject: string; message: string } | null;
  update: (patch: Partial<ProjectBrief>) => void; setStep: (step: number) => void;
  prepare: () => void; consume: () => void; reset: () => void;
}>((set, get) => ({
  draft: { ...emptyBrief }, step: 0, pending: null,
  update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  setStep: (step) => set({ step }),
  prepare: () => set({ pending: { subject: `${get().draft.kind} enquiry`.slice(0, 200), message: formatBrief(get().draft) } }),
  consume: () => set({ pending: null }),
  reset: () => set({ draft: { ...emptyBrief }, step: 0, pending: null }),
}));
