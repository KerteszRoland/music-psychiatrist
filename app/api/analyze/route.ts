import { analyzeSong } from "@/lib/analyze-lyrics";
import { getCreditsStatus, isOutOfCreditsError, toApiError } from "@/lib/credits";
import { findStoredAnalysisBySong, saveAnalysis } from "@/lib/storage";
import type { AnalyzeRequest, ApiError, StoredAnalysis } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

const requestSchema = z.object({
  artist: z.string().trim().min(1, "Artist is required").max(120),
  title: z.string().trim().min(1, "Song title is required").max(120),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message ?? "Invalid request";
      return NextResponse.json(
        { error: message, code: "VALIDATION_ERROR" } satisfies ApiError,
        { status: 400 },
      );
    }

    const credits = await getCreditsStatus();
    if (credits.available && credits.outOfCredits) {
      return NextResponse.json(
        {
          error: "OpenRouter credits exhausted. Add credits to continue analyzing songs.",
          code: "OUT_OF_CREDITS",
        } satisfies ApiError,
        { status: 402 },
      );
    }

    const cached = await findStoredAnalysisBySong(parsed.data);
    if (cached) {
      return NextResponse.json(cached satisfies StoredAnalysis);
    }

    const result = await analyzeSong(parsed.data);
    const stored = await saveAnalysis(result);
    return NextResponse.json(stored);
  } catch (error) {
    const { message, code } = toApiError(error);
    const status = code === "OUT_OF_CREDITS" || isOutOfCreditsError(error)
      ? 402
      : message.includes("Could not find lyrics")
        ? 404
        : 500;
    return NextResponse.json({ error: message, code } satisfies ApiError, { status });
  }
}
