"use client";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage === 3) {
      // A failed or stalled media request must never trap visitors in the intro.
      const fallback = setTimeout(onComplete, 6500);
      return () => clearTimeout(fallback);
    }
    const timer = setTimeout(() => setStage(s => s + 1), stage === 2 ? 1700 : 800);
    return () => clearTimeout(timer);
  }, [stage, onComplete]);
  return <section className="intro-screen" aria-label="Welcome to Elisha Creatives">
    <div className="intro-content" aria-live="polite">
      {stage < 2 && <p key={stage} className="intro-role">{stage === 0 ? "Designer." : "Developer."}</p>}
      {stage === 2 && <p className="intro-manifesto">{["Imagine.", "Design.", "Develop.", "Create."].map((word, i) => <span key={word} style={{ animationDelay: i * 220 + "ms" }}>{word}</span>)}</p>}
      {stage === 3 && <video className="intro-reveal" src="/media/elisha-reveal.mp4" autoPlay muted playsInline preload="auto" aria-label="Elisha Creatives logo reveal" onEnded={onComplete} onError={onComplete} />}
    </div>
    <button className="intro-skip" onClick={() => flushSync(onComplete)}>Skip intro <span aria-hidden>?</span></button>
  </section>;
}
