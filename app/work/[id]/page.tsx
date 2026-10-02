import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { works } from "@/data/works";
import { WorkDetail } from "@/components/shared/WorkDetail";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { siteUrl } from "@/lib/site";
// Let unknown IDs reach notFound() instead of the static fallback error path.
export const dynamicParams = true;
export function generateStaticParams() { return works.map(work => ({ id: work.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = works.find(w => w.id === id);
  if (!work) return { title: "Project not found" };
  return { title: work.title, description: work.description,
    ...(siteUrl ? { alternates: { canonical: `/work/${id}` } } : {}),
    openGraph: { title: `${work.title} | Elisha Creatives`, description: work.description, ...(siteUrl ? { images: [{ url: work.imageSrc, alt: work.title }] } : {}) },
    twitter: { card: "summary_large_image", title: work.title, description: work.description, ...(siteUrl ? { images: [work.imageSrc] } : {}) } };
}
export default async function WorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = works.find(w => w.id === id);
  if (!work) notFound();
  return <main className="project-page"><header className="project-page-header"><Link href="/"><BrandLogo white className="w-60 max-w-full" /></Link><Link href="/work">All projects ↗</Link></header><div className="project-sheet"><WorkDetail work={work} standalone /><div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6"><Link className="button-secondary" href={`/#works/${work.id}`}>View in workspace</Link><Link className="button-primary" href="/#contact">Start a project ↗</Link></div></div></main>;
}
