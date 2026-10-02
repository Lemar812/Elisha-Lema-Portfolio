import Image from "next/image";
import Link from "next/link";
import { works, type Work } from "@/data/works";
import { projectStories } from "@/data/projectStories";
export function WorkDetail({ work, standalone = false }: { work: Work; standalone?: boolean }) {
  const story = projectStories[work.id];
  const related = works.filter(item => story?.relatedIds?.includes(item.id));
  return <article className="space-y-6">
    <div><p className="eyebrow text-muted">{story ? "Selected project / " : ""}{work.category}</p>{standalone ? <h1 className="mt-2 text-3xl font-semibold text-heading">{work.title}</h1> : <h2 className="mt-2 text-2xl font-semibold text-heading">{work.title}</h2>}</div>
    <p className="text-sm leading-relaxed text-ink">{work.description}</p>
    <div className="work-image"><Image src={work.imageSrc} alt={`${work.title} — ${work.category} by Elisha Creatives`} fill sizes={standalone ? "(min-width: 900px) 800px, 92vw" : "(min-width: 640px) 520px, 92vw"} className="object-contain" priority={standalone} /></div>
    <a href={work.imageSrc} target="_blank" rel="noopener noreferrer" className="artwork-link">View full-size artwork ↗</a>
    <dl className="work-meta"><div><dt>Discipline</dt><dd>{work.category === "Logo" ? "Visual identity" : work.category === "Website" ? "Web design & development" : "Graphic design"}</dd></div><div><dt>By</dt><dd>Elisha Lema · Elisha Creatives</dd></div></dl>
    {story && <div className="project-story">
      <section><p className="eyebrow text-muted">01 / Context</p><h3>The project</h3><p>{story.context}</p></section>
      <section><p className="eyebrow text-muted">02 / Design focus</p><h3>What the design communicates</h3><p>{story.focus}</p><ul>{story.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul></section>
      <section><p className="eyebrow text-muted">03 / Deliverables</p><h3>The finished work</h3><ul>{story.deliverables.map(item => <li key={item}>{item}</li>)}</ul></section>
      {story.result && <section><p className="eyebrow text-muted">04 / Results</p><p>{story.result}</p></section>}
    </div>}
    {related.length > 0 && <section className="space-y-4"><h3 className="text-heading font-semibold">Across the project</h3>{related.map(item => <figure key={item.id}><div className="work-image"><Image src={item.imageSrc} alt={item.title} fill sizes="(min-width: 640px) 520px, 92vw" className="object-contain" /></div><figcaption className="mt-2 text-xs text-muted"><a href={item.imageSrc} target="_blank" rel="noopener noreferrer">{item.title} ↗</a></figcaption></figure>)}</section>}
    <div className="flex flex-wrap gap-2">{work.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
    <div className="flex flex-wrap gap-3">{!standalone && <a href={`/work/${work.id}`} target="_blank" rel="noopener noreferrer" className="button-secondary">Open project page ↗</a>}{work.websiteUrl && <a href={work.websiteUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Visit website ↗</a>}</div>
    <Link className="artwork-link" href="/#contact">Have a project in mind? Let’s talk ↗</Link>
  </article>;
}
