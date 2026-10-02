import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { featuredWorkIds } from "@/data/projectStories";
import { works } from "@/data/works";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { siteUrl } from "@/lib/site";
export const metadata: Metadata = { title: "Selected work", description: "Explore logo design, posters, banners, and website work by Elisha Creatives.", ...(siteUrl ? { alternates: { canonical: "/work" } } : {}) };
export default function WorkIndex() {
  return <main className="project-page"><header className="project-page-header"><Link href="/"><BrandLogo white className="w-60 max-w-full" /></Link><Link href="/#works">Open workspace ↗</Link></header>
    <section className="project-sheet"><p className="eyebrow text-muted">Elisha Creatives / Portfolio</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-heading">Selected work.</h1><p className="mt-4 text-muted">Visual identities, promotional design, and websites by Elisha Lema.</p>
    <div className="project-grid">{[...works].sort((a, b) => Number(featuredWorkIds.includes(b.id)) - Number(featuredWorkIds.includes(a.id))).map(work => <Link href={`/work/${work.id}`} className="project-card" key={work.id}>{featuredWorkIds.includes(work.id) && <span className="featured-badge">Featured project</span>}<div className="work-image"><Image src={work.imageSrc} alt={work.title} fill sizes="(min-width: 900px) 280px, (min-width: 600px) 42vw, 85vw" className="object-contain" /></div><p className="eyebrow mt-4 text-muted">{work.category}</p><h2 className="mt-2 text-sm font-semibold text-heading">{work.title} ↗</h2></Link>)}</div></section>
  </main>;
}
