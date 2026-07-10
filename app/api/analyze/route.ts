import { analyzeSong } from "@/lib/analyze-lyrics";
import type { AnalyzeRequest, ApiError } from "@/lib/types";
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
      return NextResponse.json({ error: message } satisfies ApiError, { status: 400 });
    }

    const result = await analyzeSong(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    const status = message.includes("Could not find lyrics") ? 404 : 500;
    return NextResponse.json({ error: message } satisfies ApiError, { status });
  }
}
