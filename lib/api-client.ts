import type {
  ApiError,
  CreditsStatus,
  RecentAnalysisSummary,
  StoredAnalysis,
  AnalyzeRequest,
} from "@/lib/types";

export async function analyzeSongRequest(
  payload: AnalyzeRequest,
): Promise<StoredAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as StoredAnalysis | ApiError;

  if (!response.ok) {
    const message = "error" in data ? data.error : "Analysis failed";
    const error = new Error(message) as Error & { code?: string };
    if ("code" in data && data.code) {
      error.code = data.code;
    }
    throw error;
  }

  return data as StoredAnalysis;
}

export async function fetchRecentAnalyses(): Promise<RecentAnalysisSummary[]> {
  const response = await fetch("/api/recent");
  if (!response.ok) {
    return [];
  }
  return (await response.json()) as RecentAnalysisSummary[];
}

export async function fetchCreditsStatus(): Promise<CreditsStatus> {
  const response = await fetch("/api/credits");
  if (!response.ok) {
    return {
      available: false,
      provider: "unknown",
      limitRemaining: null,
      limit: null,
      usage: 0,
      isFreeTier: false,
      outOfCredits: false,
      lowCredits: false,
      message: "Could not load credit status.",
    };
  }
  return (await response.json()) as CreditsStatus;
}

export async function fetchStoredAnalysis(id: string): Promise<StoredAnalysis | null> {
  const response = await fetch(`/api/analyze/${id}`);
  if (!response.ok) return null;
  return (await response.json()) as StoredAnalysis;
}
