import { AnalysisPageClient } from "@/components/analysis-page-client";
import { getStoredAnalysis } from "@/lib/storage";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AnalysisPageProps): Promise<Metadata> {
  const { id } = await params;
  const analysis = await getStoredAnalysis(id);

  if (!analysis) {
    return {
      title: "Analysis not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${analysis.song.title} by ${analysis.song.artist}`;
  const description = analysis.summary;
  const url = absoluteUrl(`/analysis/${id}`);
  const themes = analysis.dominantThemes.join(", ");

  return {
    title,
    description,
    keywords: [
      analysis.song.artist,
      analysis.song.title,
      "lyric analysis",
      "schema therapy",
      ...analysis.dominantThemes,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: analysis.createdAt,
      tags: analysis.dominantThemes,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    other: {
      "music:song": analysis.song.title,
      "music:musician": analysis.song.artist,
      "article:tag": themes,
    },
  };
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const analysis = await getStoredAnalysis(id);

  if (!analysis) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        ← Back to search
      </Link>
      <AnalysisPageClient analysis={analysis} />
    </div>
  );
}
