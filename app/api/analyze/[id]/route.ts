import { getStoredAnalysis } from "@/lib/storage";
import type { ApiError } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const analysis = await getStoredAnalysis(id);

  if (!analysis) {
    return NextResponse.json(
      { error: "Analysis not found", code: "NOT_FOUND" } satisfies ApiError,
      { status: 404 },
    );
  }

  return NextResponse.json(analysis);
}
