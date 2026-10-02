"use client";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useWindowStore } from "@/lib/windowStore";
export function WelcomeApp() {
  const { openApp, closeApp, selectWork } = useWindowStore();
  const open = (id: "works" | "contact" | "help") => { closeApp("welcome"); if (id === "works") selectWork(null, "Featured"); openApp(id); };
  return <section className="welcome-window">
    <p className="eyebrow text-muted">Independent creative studio · Tanzania</p>
    <BrandLogo white className="w-64 max-w-full my-6" />
    <h1 className="text-4xl font-semibold tracking-tight text-heading">Good design.<br /><span className="text-muted">A stronger presence.</span></h1>
    <p className="mt-5 max-w-md text-sm leading-relaxed text-ink">I’m Elisha Lema. I create visual identities, promotional design, and websites that help businesses present themselves clearly.</p>
    <div className="mt-7 flex flex-wrap gap-3"><button className="button-primary" onClick={() => open("works")}>Explore my work ↗</button><button className="button-secondary" onClick={() => open("contact")}>Start a project</button></div>
    <div className="welcome-bottom"><span>Elisha Creatives / Your creative workspace</span><button onClick={() => open("help")}>Take a quick tour ↗</button></div>
  </section>;
}
