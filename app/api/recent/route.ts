import { getRecentAnalyses } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function GET() {
  const recent = await getRecentAnalyses();
  return NextResponse.json(recent);
}
