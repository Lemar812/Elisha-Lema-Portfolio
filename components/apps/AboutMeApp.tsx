"use client";
import { useState } from "react";
import Image from "next/image";
import { profile, stats } from "@/data/profile";
import { skills, techStack } from "@/data/skills";
import { MetaRow } from "@/components/shared/MetaRow";
import { StatGrid } from "@/components/shared/StatGrid";
import { SkillBar } from "@/components/shared/SkillBar";
import { useWindowStore } from "@/lib/windowStore";
const sections = ["Overview", "Journey", "Approach", "The brand"] as const;
export function AboutMeApp() {
  const [section, setSection] = useState<(typeof sections)[number]>("Overview");
  const openApp = useWindowStore(s => s.openApp);
  return <div className="about-app">
    <nav className="about-tabs" aria-label="About sections">{sections.map(label => <button key={label} aria-pressed={section === label} onClick={() => setSection(label)}>{label}</button>)}</nav>
    <div className="space-y-7 p-6" key={section}>
      <div className="flex items-center gap-4"><Image src="/works/me.jpeg" alt={`Portrait of ${profile.name}`} width={80} height={80} className="h-20 w-20 rounded-xl object-cover" /><div><p className="eyebrow text-muted">Behind Elisha Creatives</p><h2 className="mt-2 text-3xl font-semibold text-heading">{profile.name}</h2><p className="mt-1 text-sm text-muted">{profile.title}</p></div></div>
      {section === "Overview" && <><p className="text-base leading-relaxed text-ink">{profile.tagline}</p><MetaRow items={[{ label: "Location", value: profile.location }, { label: "Experience", value: profile.experience }, { label: "Email", value: profile.email }]} /><StatGrid stats={stats} /><p className="text-sm leading-relaxed text-muted">{profile.bio[0]}</p><h3 className="text-xl font-semibold text-heading">Design and development, together.</h3><p className="text-sm leading-relaxed text-muted">From a business identity to the materials and website that carry it, my work spans the places a brand meets its audience.</p></>}
      {section === "Journey" && <><h3 className="text-2xl font-semibold text-heading">A growing creative practice.</h3><div className="journey-entry"><p className="eyebrow text-muted">2024 / Freelance work</p><p>My freelance work began in 2024, bringing together graphic design and web development.</p></div><div className="journey-entry"><p className="eyebrow text-muted">Teaching & technology</p><p>At The School of St Jude, my ESL and typing internship included supporting learners and helping maintain instructional software.</p></div><div className="journey-entry"><p className="eyebrow text-muted">Software development</p><p>I completed a scholarship program with Power Learn Project Academy, including Dart and Flutter.</p></div><div className="journey-entry"><p className="eyebrow text-muted">Now / Elisha Creatives</p><p>My identity design, promotional artwork, and website work now share one name: Elisha Creatives.</p></div></>}
      {section === "Approach" && <><h3 className="text-2xl font-semibold text-heading">Clear communication. Useful design.</h3><p className="text-sm leading-relaxed text-muted">I bring an interest in practical technology to my design work, with a focus on clear communication and useful digital experiences.</p><h4 className="eyebrow text-muted">Skills · self-assessed</h4><div className="grid gap-4 sm:grid-cols-2">{skills.map(skill => <SkillBar key={skill.name} skill={skill} />)}</div><h4 className="eyebrow text-muted">Tools & technology</h4><div className="flex flex-wrap gap-2">{techStack.map(tech => <span className="tag" key={tech}>{tech}</span>)}</div></>}
      {section === "The brand" && <><h3 className="text-2xl font-semibold text-heading">One signature. Many possibilities.</h3><p className="text-sm leading-relaxed text-muted">The Elisha Creatives signature and wordmark connect my design and web development work. Navy, white, and dark surfaces form the visual language of this workspace.</p><video className="brand-film" controls playsInline preload="none" poster="/brand/social-preview.png" src="/media/elisha-motion.mp4" aria-label="Elisha Creatives logo animation" /><p className="text-xs text-muted">The complete Elisha Creatives logo motion.</p></>}
      <div className="flex flex-wrap gap-3 border-t border-line pt-5"><button className="button-primary" onClick={() => openApp("contact")}>Work with me ↗</button><button className="button-secondary" onClick={() => openApp("resume")}>View my CV</button></div>
    </div>
  </div>;
}
