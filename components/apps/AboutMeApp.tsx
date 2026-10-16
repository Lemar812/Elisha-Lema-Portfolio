"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { works } from "@/data/works";
import { techStack } from "@/data/skills";
import { journey, capabilities, process } from "@/data/about";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useWindowStore } from "@/lib/windowStore";

const sections = [
  { label: "Meet Elisha", note: "The person", short: "Meet Elisha" },
  { label: "The connection", note: "Design meets code", short: "My craft" },
  { label: "My journey", note: "The story so far", short: "My journey" },
  { label: "The signature", note: "Behind the brand", short: "The brand" },
];
const examples = [
  { id: "work-1", label: "Visual identity", text: "A recognisable face for a business." },
  { id: "work-19", label: "Web development", text: "A place for a business to be explored." },
];
export function AboutMeApp({ onNavigate, onWork }: { onNavigate?: (id: import('@/lib/windowStore').AppId) => void; onWork?: (id?: string) => void }) {
  const [section, setSection] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const legacyOpenApp = useWindowStore(s => s.openApp);
  const openApp = onNavigate ?? legacyOpenApp;
  function navigate(next: number, fromContent = false) {
    setSection(next);
    root.current?.closest(".window-content, .app-content")?.scrollTo({ top: 0 });
    if (fromContent) requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % sections.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + sections.length - 1) % sections.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = sections.length - 1;
    else return;
    event.preventDefault(); navigate(next);
    root.current?.querySelector<HTMLButtonElement>(`#bio-tab-${next}`)?.focus();
  }
  function explore(id?: string) {
    const work = works.find(w => w.id === id);
    if (onWork) { onWork(work?.id); return; }
    useWindowStore.getState().selectWork(work?.id ?? null, work?.category ?? "Featured");
    openApp("works");
  }
  return <div className="bio-app" ref={root}><div className="bio-layout">
    <aside className="bio-rail">
      <div className="bio-rail-brand"><BrandLogo white signature /><span>ELISHA<br />CREATIVES</span></div>
      <p className="bio-rail-caption">A closer look</p>
      <div className="bio-tabs" role="tablist" aria-label="About sections">{sections.map((item, i) => <button key={item.label} role="tab" id={`bio-tab-${i}`} aria-label={item.label} aria-controls="bio-panel" aria-selected={section === i} tabIndex={section === i ? 0 : -1} onClick={() => navigate(i)} onKeyDown={event => tabKey(event, i)}><span className="bio-tab-number" aria-hidden>0{i + 1}</span><span><strong className="bio-tab-long">{item.label}</strong><strong className="bio-tab-short">{item.short}</strong><small>{item.note}</small></span></button>)}</div>
      <div className="bio-rail-contact"><span>Have something in mind?</span><button onClick={() => openApp("contact")}>Let’s talk <span aria-hidden>↗</span></button></div>
    </aside>
    <div id="bio-panel" className="bio-main" role="tabpanel" aria-labelledby={`bio-tab-${section}`}>
      <div className="bio-page-meta"><span>About Elisha</span><span>0{section + 1} / 04</span></div>
      {section === 0 && <>
        <div className="bio-intro"><div className="bio-intro-copy"><p className="bio-kicker">The person behind the work</p><h2 className="bio-name" tabIndex={-1} ref={heading}>Elisha<br /><span>Lema.</span></h2><p className="bio-positioning">Design-minded.<br />Development-driven.</p><p className="bio-description">I connect how a brand looks with how its website works. A designer and developer, bringing both sides to Elisha Creatives.</p><button className="bio-primary" onClick={() => explore()}>Explore my work <span aria-hidden>↗</span></button></div>
          <figure className="bio-portrait"><Image src="/works/me.jpeg" alt="Portrait of Elisha Lema" fill sizes="(max-width: 600px) 90vw, (max-width: 1200px) 38vw, 480px" priority /><span className="bio-portrait-mark" aria-hidden><BrandLogo white signature /></span><figcaption><span>DESIGNER & DEVELOPER</span><strong>Two disciplines.<br />One perspective.</strong></figcaption></figure>
        </div>
        <dl className="bio-facts" aria-label="About highlights"><div><dt>Creatives</dt><dd>{works.length}<span>in the portfolio</span></dd></div><div><dt>Freelancing since</dt><dd>2024<span>learning through practice</span></dd></div><div><dt>Based in</dt><dd>Tanzania<span>designing & developing</span></dd></div></dl>
        <div className="bio-overview-bottom"><section className="bio-origin"><p className="bio-kicker">How it began</p><h3>Programming came first.<br />Design opened another door.</h3><p>A tech community helped me begin in secondary school. Connecting the two disciplines became the foundation of my creative practice.</p><button className="bio-link" onClick={() => navigate(2, true)}>Follow my journey <span aria-hidden>→</span></button></section><section className="bio-audience"><p className="bio-kicker">Who I work with</p><h3>Business owners.<br />Corporate teams.</h3><p>From startups finding their identity to established businesses building their digital presence.</p><button className="bio-link" onClick={() => openApp("contact")}>Tell me about your project <span aria-hidden>↗</span></button></section></div>
      </>}
      {section === 1 && <>
        <header className="bio-heading"><p className="bio-kicker">Design + development</p><h2 ref={heading} tabIndex={-1}>Considered in design.<br /><span>Connected by code.</span></h2><p>Frontend is my main development focus: the things people see, navigate, and use. Visual design gives that experience its identity.</p></header>
        <div className="bio-projects">{examples.map((example, i) => { const work = works.find(w => w.id === example.id); return work && <button key={work.id} className={`bio-project bio-project-${i}`} aria-label={`Explore ${work.title}`} onClick={() => explore(work.id)}><span className="bio-project-visual">{i === 1 && <span className="bio-browser-bar" aria-hidden><i /><i /><i /><span>NatureWiseTours / Website</span></span>}<span className="bio-project-image"><Image src={work.imageSrc} alt={work.title} fill sizes="(max-width: 600px) 90vw, (max-width: 1200px) 40vw, 560px" /></span><span className="bio-project-open" aria-hidden>↗</span></span><span className="bio-project-caption"><span><span className="bio-kicker">{example.label}</span><strong className="bio-project-title">{work.title}</strong><span className="bio-project-description">{example.text}</span></span><span className="bio-project-index" aria-hidden>0{i + 1}</span></span></button>; })}</div>
        <section className="bio-capabilities" aria-label="Capabilities">{capabilities.map((item, i) => <article key={item.title}><span className="bio-kicker">0{i + 1} / Capability</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</section>
        <section className="bio-process"><div><p className="bio-kicker">From idea to outcome</p><h3>A clear way forward.</h3></div><ol>{process.map((item, i) => <li key={item.title}><span aria-hidden>0{i + 1}</span><h4>{item.title}.</h4><p>{item.text}</p></li>)}</ol></section>
        <details className="bio-toolbox"><summary>Tools behind the work <span aria-hidden>+</span></summary><div>{techStack.map(tech => <span key={tech}>{tech}</span>)}</div></details>
      </>}
      {section === 2 && <>
        <header className="bio-heading"><p className="bio-kicker">The story so far</p><h2 ref={heading} tabIndex={-1}>Built on curiosity.<br /><span>Shaped by doing.</span></h2><p>Each chapter brought something different: a technical foundation, real clients, and an understanding of how people use technology.</p></header>
        <div className="bio-journey-layout"><ol className="bio-timeline">{journey.map((item, i) => <li key={item.title}><details open={i === 0 ? true : undefined}><summary><span className="bio-timeline-date">{item.date}</span><strong>{item.title}</strong><span className="bio-expand" aria-hidden>+</span></summary><p>{item.text}</p></details></li>)}</ol><aside className="bio-learning-note"><span className="bio-kicker">What connects the chapters</span><p>Learning.<br />Making.<br /><em>Connecting.</em></p><span>Programming came first. Design gave me another way to bring ideas to life.</span><button className="bio-link" onClick={() => openApp("resume")}>View my CV <span aria-hidden>↗</span></button></aside></div>
      </>}
      {section === 3 && <>
        <header className="bio-heading"><p className="bio-kicker">The meaning behind the mark</p><h2 ref={heading} tabIndex={-1}>Different disciplines.<br /><span>One signature.</span></h2><p>Elisha Creatives is the name that brings everything I make together.</p></header>
        <div className="bio-brand-showcase"><div className="bio-signature-stage"><span className="bio-kicker">01 / The signature</span><BrandLogo white signature /><span className="bio-brand-label">A lowercase “e”. My name, made into a mark.</span></div><div className="bio-initials-stage"><span className="bio-kicker">02 / The initials</span><strong>ec</strong><span className="bio-brand-label">Elisha Creatives. A shared identity.</span></div></div>
        <div className="bio-brand-story"><div><p className="bio-kicker">Creative work, by Elisha</p><h3>The skills came first.<br />The identity followed.</h3></div><div><p>I had skills and work to offer, but needed a clear identity to bring them together. That is where Elisha Creatives began.</p><p>“Elisha” is my name. “Creatives” represents the work I produce across design and development. Together, the name means creative work made by Elisha.</p><p>The lowercase “e” signature and “ec” initials connect those different things through one recognisable identity.</p></div></div>
        <details className="bio-brand-film"><summary><span className="bio-play" aria-hidden>▷</span><span>See the signature come to life<small>The Elisha Creatives identity film</small></span><span className="bio-expand" aria-hidden>+</span></summary><video controls playsInline preload="none" poster="/brand/social-preview.png" src="/media/elisha-motion.mp4" aria-label="Elisha Creatives logo animation" /></details>
      </>}
      <footer className="bio-footer"><span>Elisha Lema <span aria-hidden>/</span> Elisha Creatives</span>{section < 3 ? <button onClick={() => navigate(section + 1, true)}><small>Continue exploring</small>{sections[section + 1].label} <span aria-hidden>→</span></button> : <button onClick={() => openApp("contact")}><small>Have an idea?</small>Work with me <span aria-hidden>↗</span></button>}</footer>
    </div>
  </div></div>;
}
