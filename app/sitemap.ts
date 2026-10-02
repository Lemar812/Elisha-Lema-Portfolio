import type { MetadataRoute } from "next";
import { works } from "@/data/works";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return ["/", "/work", ...works.map(w => "/work/" + w.id)].map(path => ({ url: siteUrl + path }));
}
