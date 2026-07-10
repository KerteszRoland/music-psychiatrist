import { generateObject } from "ai";
import { z } from "zod";
import { createLanguageModel } from "@/lib/ai/provider";
import {
  ALL_LABELS,
  COPING_STYLES,
  EARLY_MALADAPTIVE_SCHEMAS,
  SCHEMA_MODES,
  THERAPEUTIC_SIGNALS,
  labelCategory,
} from "@/lib/schema-labels";
import type { AnalysisLabel, AnalysisResult, SongInfo } from "@/lib/types";

const labelSchema = z.object({
  label: z.enum(ALL_LABELS as unknown as [string, ...string[]]),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence that this pattern or signal is present in the lyrics (0.0 to 1.0)"),
  evidence: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe("Short quoted fragments or paraphrased lines from the lyrics"),
  rationale: z
    .string()
    .describe("Brief clinical-style explanation linking the lyric evidence to the label"),
});

const analysisSchema = z.object({
  labels: z
    .array(labelSchema)
    .min(1)
    .max(12)
    .describe("Most relevant schema therapy patterns and signals, sorted by confidence descending"),
  dominantThemes: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("High-level emotional/psychological themes in plain language"),
  summary: z
    .string()
    .describe("2-4 sentence overview of the lyrical psychological landscape"),
});

function buildPrompt(song: SongInfo, lyrics: string): string {
  return `You are a clinical psychology assistant trained in Schema Therapy (Young, Arntz).
Analyze the song lyrics below for schema therapy patterns and psychological signals.

Rules:
- Only use labels from the allowed taxonomy below.
- Confidence must reflect how clearly the lyrics express each pattern (0.0 = absent, 1.0 = strongly present).
- Prefer precision over quantity: include labels only when there is textual evidence.
- evidence must cite specific lyric lines or tight paraphrases.
- Do not diagnose real people. This is lyrical/thematic analysis only.
- Ignore production metadata; focus on narrative voice, emotional tone, relational themes, and coping behavior described in the lyrics.

Allowed Early Maladaptive Schemas:
${EARLY_MALADAPTIVE_SCHEMAS.map((s) => `- ${s}`).join("\n")}

Allowed Schema Modes:
${SCHEMA_MODES.map((s) => `- ${s}`).join("\n")}

Allowed Coping Styles:
${COPING_STYLES.map((s) => `- ${s}`).join("\n")}

Allowed Therapeutic Signals:
${THERAPEUTIC_SIGNALS.map((s) => `- ${s}`).join("\n")}

Song: "${song.title}" by ${song.artist}

Lyrics:
"""
${lyrics}
"""`;
}

export async function analyzeLyrics(
  song: SongInfo,
  lyrics: string,
  lyricsSource: AnalysisResult["lyricsSource"],
): Promise<AnalysisResult> {
  const model = createLanguageModel();

  const { object } = await generateObject({
    model,
    schema: analysisSchema,
    prompt: buildPrompt(song, lyrics),
    temperature: 0.2,
  });

  const labels: AnalysisLabel[] = object.labels
    .map((entry) => ({
      label: entry.label,
      category: labelCategory(entry.label),
      confidence: roundConfidence(entry.confidence),
      evidence: entry.evidence,
      rationale: entry.rationale,
    }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    song,
    lyricsSource,
    labels,
    dominantThemes: object.dominantThemes,
    summary: object.summary,
  };
}

function roundConfidence(value: number): number {
  return Math.round(Math.min(1, Math.max(0, value)) * 1000) / 1000;
}

export async function analyzeSong(song: SongInfo): Promise<AnalysisResult> {
  const { fetchLyrics } = await import("@/lib/fetch-lyrics");
  const { lyrics, source } = await fetchLyrics(song);
  return analyzeLyrics(song, lyrics, source);
}
