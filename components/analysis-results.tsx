"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_LABELS } from "@/lib/schema-labels";
import type { AnalysisLabel, AnalysisResult, LabelCategory, StoredAnalysis } from "@/lib/types";
import { confidenceColor, formatConfidence } from "@/lib/utils";
import {
  AlertCircle,
  Brain,
  Quote,
  Sparkles,
  Tags,
} from "lucide-react";
import { ShareLink } from "@/components/share-link";

function categoryBadgeVariant(category: LabelCategory) {
  switch (category) {
    case "early_maladaptive_schema":
      return "schema" as const;
    case "schema_mode":
      return "mode" as const;
    case "coping_style":
      return "coping" as const;
    default:
      return "signal" as const;
  }
}

function LabelCard({ label }: { label: AnalysisLabel }) {
  const percent = Math.round(label.confidence * 100);

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="px-5 pb-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-lg">{label.label}</CardTitle>
            <Badge variant={categoryBadgeVariant(label.category)}>
              {CATEGORY_LABELS[label.category]}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tabular-nums">{formatConfidence(label.confidence)}</p>
            <p className="text-muted-foreground text-xs">confidence</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        <div className="space-y-2">
          <Progress value={percent} className="h-2" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">0.0</span>
            <span className={`inline-block size-2 rounded-full ${confidenceColor(label.confidence)}`} />
            <span className="text-muted-foreground">1.0</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
            <Quote className="size-3.5" />
            Evidence
          </p>
          <ul className="space-y-1.5">
            {label.evidence.map((line) => (
              <li key={line} className="bg-muted/60 rounded-md px-3 py-2 text-sm italic">
                &ldquo;{line}&rdquo;
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm leading-relaxed">{label.rationale}</p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
      </Card>
      {[1, 2, 3].map((item) => (
        <Card key={item} className="py-5">
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ResultsView({
  data,
  showShareLink = false,
}: {
  data: AnalysisResult | StoredAnalysis;
  showShareLink?: boolean;
}) {
  const analysisId = "id" in data ? data.id : undefined;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
                <Sparkles className="text-primary size-5" />
                {data.song.title}
                <span className="text-muted-foreground font-normal">by {data.song.artist}</span>
              </CardTitle>
              <CardDescription>
                Lyrics source: {data.lyricsSource} · {data.labels.length} patterns detected
              </CardDescription>
            </div>
            {showShareLink && analysisId && <ShareLink analysisId={analysisId} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{data.summary}</p>
          <div className="space-y-2">
            <p className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
              <Tags className="size-3.5" />
              Dominant themes
            </p>
            <div className="flex flex-wrap gap-2">
              {data.dominantThemes.map((theme) => (
                <Badge key={theme} variant="secondary">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="size-5" />
          Detected patterns
        </h2>
        <div className="grid gap-4">
          {data.labels.map((label) => (
            <LabelCard key={`${label.label}-${label.confidence}`} label={label} />
          ))}
        </div>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex gap-3 pt-6 text-sm">
          <AlertCircle className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <p className="text-muted-foreground leading-relaxed">
            This is thematic lyrical analysis for research and creative exploration.
            It is not a clinical diagnostic tool and must not be used to assess real individuals.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalysisResults({
  data,
  showShareLink = false,
}: {
  data: AnalysisResult | StoredAnalysis;
  showShareLink?: boolean;
}) {
  return <ResultsView data={data} showShareLink={showShareLink} />;
}

AnalysisResults.Loading = LoadingState;
