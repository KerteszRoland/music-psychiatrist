import type { AnalysisResult, AnalyzeRequest, ApiError } from "@/lib/types";

export async function analyzeSongRequest(
  payload: AnalyzeRequest,
): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as AnalysisResult | ApiError;

  if (!response.ok) {
    const message = "error" in data ? data.error : "Analysis failed";
    throw new Error(message);
  }

  return data as AnalysisResult;
}
