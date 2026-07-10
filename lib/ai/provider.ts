import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV1 } from "ai";
import type { AiProvider } from "@/lib/types";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function resolveProvider(): AiProvider {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase() as AiProvider;
  const allowed: AiProvider[] = ["openai", "anthropic", "google", "openai-compatible"];

  if (!allowed.includes(provider)) {
    throw new Error(
      `Invalid AI_PROVIDER "${provider}". Use one of: ${allowed.join(", ")}`,
    );
  }

  return provider;
}

export function createLanguageModel(): LanguageModelV1 {
  const provider = resolveProvider();
  const modelId = requireEnv("AI_MODEL");

  switch (provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
      return openai(modelId);
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
      return anthropic(modelId);
    }
    case "google": {
      const google = createGoogleGenerativeAI({
        apiKey: requireEnv("GOOGLE_GENERATIVE_AI_API_KEY"),
      });
      return google(modelId);
    }
    case "openai-compatible": {
      const compatible = createOpenAICompatible({
        name: "openai-compatible",
        apiKey: requireEnv("OPENAI_COMPATIBLE_API_KEY"),
        baseURL: requireEnv("OPENAI_COMPATIBLE_BASE_URL"),
      });
      return compatible(modelId);
    }
    default: {
      const exhaustive: never = provider;
      throw new Error(`Unhandled provider: ${exhaustive}`);
    }
  }
}
