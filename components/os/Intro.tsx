"use client";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage === 3) {
      const fallback = setTimeout(onComplete, 1800);
      return () => clearTimeout(fallback);
    }
    const timer = setTimeout(() => setStage(s => s + 1), stage === 2 ? 1700 : 800);
    return () => clearTimeout(timer);
  }, [stage, onComplete]);
  return <section className="intro-screen" aria-label="Welcome to Elisha Creatives">
    <div className="intro-content" aria-live="polite">
      {stage < 2 && <p key={stage} className="intro-role">{stage === 0 ? "Designer." : "Developer."}</p>}
      {stage === 2 && <p className="intro-manifesto">{["Imagine.", "Design.", "Develop.", "Create."].map((word, i) => <span key={word} style={{ animationDelay: i * 220 + "ms" }}>{word}</span>)}</p>}
      {stage === 3 && <div className="intro-brand"><p className="intro-brand-kicker">Independent design &amp; development</p><h1>Elisha <span>Creatives</span></h1><div className="intro-brand-rule" /><p className="intro-brand-byline">by <strong>Elisha Lema</strong></p></div>}
    </div>
    <button className="intro-skip" onClick={() => flushSync(onComplete)}>Skip intro <span aria-hidden>&rarr;</span></button>
  </section>;
}
