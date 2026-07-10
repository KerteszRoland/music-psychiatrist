"use client";

import { AnalysisResults } from "@/components/analysis-results";
import { CreditsBanner } from "@/components/credits-banner";
import type { StoredAnalysis } from "@/lib/types";

interface AnalysisPageClientProps {
  analysis: StoredAnalysis;
}

export function AnalysisPageClient({ analysis }: AnalysisPageClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <CreditsBanner />
      <AnalysisResults data={analysis} showShareLink />
    </div>
  );
}
