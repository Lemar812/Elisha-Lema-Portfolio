import { works } from "@/data/works";
import { projectStories, featuredWorkIds } from "@/data/projectStories";
export interface ProjectMeta {
  slug: string;
  displayName: string;
  tagline: string;
  story: string[];
  achievements: { metric: string; label: string; detail: string }[];
  featured: boolean;
  category: "personal" | "org" | "meta";
  status: "active" | "completed" | "experimental";
  extraTech?: string[];
  repoUrl?: string;
  liveUrl?: string;
  descriptionOverride?: string;
  liveLabel?: string;
  researchUrl?: string;
}
export const projectMeta: Record<string, ProjectMeta> = Object.fromEntries(
  works.map((work) => {
    const story = projectStories[work.id];
    return [
      work.id,
      {
        slug: work.id,
        displayName: work.title,
        tagline: work.description,
        story: story
          ? [story.context, story.focus, ...story.decisions]
          : [work.description],
        achievements: [],
        featured: featuredWorkIds.includes(work.id),
        category: "personal",
        status: "completed",
        extraTech: work.tags,
        liveUrl: work.websiteUrl,
      },
    ];
  }),
);
export const featuredRank = (name: string) => {
  const n = featuredWorkIds.indexOf(name);
  return n < 0 ? 999 : n;
};
