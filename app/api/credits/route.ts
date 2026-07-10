import { getCreditsStatus } from "@/lib/credits";
import { NextResponse } from "next/server";

export async function GET() {
  const credits = await getCreditsStatus();
  return NextResponse.json(credits);
}
