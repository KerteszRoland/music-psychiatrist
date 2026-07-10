import type { CreditsStatus } from "@/lib/types";

const OPENROUTER_KEY_URL = "https://openrouter.ai/api/v1/key";
const LOW_CREDIT_RATIO = 0.2;

function isLowCredits(limitRemaining: number | null, limit: number | null): boolean {
  if (limit === null || limit <= 0 || limitRemaining === null) return false;
  if (limitRemaining <= 0) return false;
  return limitRemaining < limit * LOW_CREDIT_RATIO;
}

interface OpenRouterKeyResponse {
  data?: {
    limit?: number | null;
    limit_remaining?: number | null;
    usage?: number;
    is_free_tier?: boolean;
  };
}

export function isOpenRouterProvider(): boolean {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  const baseUrl = process.env.OPENAI_COMPATIBLE_BASE_URL?.toLowerCase() ?? "";
  return provider === "openai-compatible" && baseUrl.includes("openrouter.ai");
}

export async function getCreditsStatus(): Promise<CreditsStatus> {
  if (!isOpenRouterProvider()) {
    return {
      available: false,
      provider: "unknown",
      limitRemaining: null,
      limit: null,
      usage: 0,
      isFreeTier: false,
      outOfCredits: false,
      lowCredits: false,
      message: "Credit tracking is only available for OpenRouter.",
    };
  }

  const apiKey = process.env.OPENAI_COMPATIBLE_API_KEY?.trim();
  if (!apiKey) {
    return {
      available: false,
      provider: "openrouter",
      limitRemaining: null,
      limit: null,
      usage: 0,
      isFreeTier: false,
      outOfCredits: true,
      lowCredits: false,
      message: "OpenRouter API key is not configured.",
    };
  }

  try {
    const response = await fetch(OPENROUTER_KEY_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        available: false,
        provider: "openrouter",
        limitRemaining: null,
        limit: null,
        usage: 0,
        isFreeTier: false,
        outOfCredits: response.status === 402,
        lowCredits: false,
        message: "Could not fetch OpenRouter credit balance.",
      };
    }

    const payload = (await response.json()) as OpenRouterKeyResponse;
    const limitRemaining = payload.data?.limit_remaining ?? null;
    const limit = payload.data?.limit ?? null;
    const usage = payload.data?.usage ?? 0;
    const isFreeTier = payload.data?.is_free_tier ?? false;

    const outOfCredits = limitRemaining !== null && limitRemaining <= 0;
    const lowCredits = isLowCredits(limitRemaining, limit);

    return {
      available: true,
      provider: "openrouter",
      limitRemaining,
      limit,
      usage,
      isFreeTier,
      outOfCredits,
      lowCredits,
    };
  } catch {
    return {
      available: false,
      provider: "openrouter",
      limitRemaining: null,
      limit: null,
      usage: 0,
      isFreeTier: false,
      outOfCredits: false,
      lowCredits: false,
      message: "Could not reach OpenRouter to check credits.",
    };
  }
}

const OUT_OF_CREDITS_PATTERNS = [
  /insufficient credits/i,
  /out of credits/i,
  /credit balance/i,
  /payment required/i,
  /402/,
  /exceeded.*quota/i,
];

export function isOutOfCreditsError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return OUT_OF_CREDITS_PATTERNS.some((pattern) => pattern.test(message));
}

export function toApiError(error: unknown): { message: string; code?: "OUT_OF_CREDITS" } {
  const message = error instanceof Error ? error.message : "Analysis failed";
  if (isOutOfCreditsError(error)) {
    return {
      message: "OpenRouter credits exhausted. Add credits to continue analyzing songs.",
      code: "OUT_OF_CREDITS",
    };
  }
  return { message };
}
