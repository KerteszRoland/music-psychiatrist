import type { MetadataRoute } from "next";
import { getRecentAnalyses } from "@/lib/storage";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recent = await getRecentAnalyses();

  const analysisEntries: MetadataRoute.Sitemap = recent.map((entry) => ({
    url: absoluteUrl(`/analysis/${entry.id}`),
    lastModified: new Date(entry.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...analysisEntries,
  ];
}
