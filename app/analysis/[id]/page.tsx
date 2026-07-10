import { AnalysisPageClient } from "@/components/analysis-page-client";
import { getStoredAnalysis } from "@/lib/storage";
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
    return { title: "Analysis not found · Music Psychiatrist" };
  }

  return {
    title: `${analysis.song.title} by ${analysis.song.artist} · Music Psychiatrist`,
    description: analysis.summary,
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
