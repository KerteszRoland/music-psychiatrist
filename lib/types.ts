export type LabelCategory =
  | "early_maladaptive_schema"
  | "schema_mode"
  | "coping_style"
  | "signal";

export interface AnalysisLabel {
  label: string;
  category: LabelCategory;
  confidence: number;
  evidence: string[];
  rationale: string;
}

export interface SongInfo {
  artist: string;
  title: string;
}

export interface LyricsResult {
  lyrics: string;
  source: "lyrics.ovh" | "lrclib";
}

export interface AnalysisResult {
  song: SongInfo;
  lyricsSource: LyricsResult["source"];
  labels: AnalysisLabel[];
  dominantThemes: string[];
  summary: string;
}

export type AiProvider = "openai" | "anthropic" | "google" | "openai-compatible";

export interface AnalyzeRequest {
  artist: string;
  title: string;
}

export interface ApiError {
  error: string;
}
