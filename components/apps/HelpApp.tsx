"use client";
import { useState } from "react";
import { useWindowStore } from "@/lib/windowStore";
const steps = [
  ["Make yourself at home.", "This is the Elisha Creatives workspace. Open a window to explore the work, meet Elisha, or start a conversation."],
  ["Choose where to begin.", "On desktop, the four shortcuts open Selected Work, About Elisha, Services, and Contact. On a phone, use the app library."],
  ["Arrange your workspace.", "Drag a window by its title bar. Minimize it to keep your place, maximize for more room, or close when you are finished. The dock brings it back."],
  ["Explore the details.", "Selected Work introduces three projects across identity, promotional design, and web. Use the category filters to browse everything. On a phone, Back to list returns to the project list."],
  ["Set the atmosphere.", "Preferences offers signature, grid, or plain backgrounds, a motion switch, music volume, and optional interface sounds. Music starts automatically when allowed, or after your first interaction. Use the music control to mute it."],
  ["Keep in touch.", "Contact opens email, WhatsApp, and phone links. Keyboard users can Tab through controls, press Escape to close a window, and move a focused title bar with Alt + arrow keys."],
];
export function HelpApp() {
  const [step, setStep] = useState(0);
  const { closeApp, openApp } = useWindowStore();
  return <div className="tour-content"><div className="flex items-center justify-between"><p className="eyebrow text-muted">Workspace guide / {step + 1} of {steps.length}</p><button className="text-sm text-muted" onClick={() => closeApp("help")}>Skip tour</button></div>
    <div className="tour-progress" aria-hidden>{steps.map((_, i) => <span key={i} className={i <= step ? "complete" : ""} />)}</div>
    <div className="tour-step" aria-live="polite"><p className="tour-number" aria-hidden>{String(step + 1).padStart(2, "0")}</p><h2 className="text-3xl font-semibold text-heading">{steps[step][0]}</h2><p className="mt-5 text-sm leading-relaxed text-muted">{steps[step][1]}</p></div>
    <div className="flex justify-between gap-3"><button className="button-secondary disabled:opacity-40" disabled={!step} onClick={() => setStep(step - 1)}>Back</button>{step < steps.length - 1 ? <button className="button-primary" onClick={() => setStep(step + 1)}>Next →</button> : <button className="button-primary" onClick={() => { closeApp("help"); openApp("works"); }}>Explore the work ↗</button>}</div>
  </div>;
}
