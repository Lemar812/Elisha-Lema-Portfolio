import { NextResponse } from "next/server";
import { getUserRepos } from "@/studio/lib/github";
export interface EnrichedRepo {
  name: string;
  displayName: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
  homepage: string | null;
}
export const revalidate = 3600;
export async function GET() {
  try {
    const repos = await getUserRepos("Lemar812");
    return NextResponse.json(
      repos.map((r) => ({
        name: r.name,
        displayName: r.name,
        description: r.description,
        htmlUrl: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at,
        topics: r.topics,
        homepage: r.homepage,
      })),
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "GitHub is temporarily unavailable" },
      { status: 502 },
    );
  }
}
