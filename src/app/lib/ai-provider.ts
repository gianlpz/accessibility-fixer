import { AxeViolation, ViolationAnalysis, AiProviderName } from "./types";
import { GeminiProvider } from "./gemini-provider";
import { SpikeProvider } from "./spike-provider";

export interface AiProvider {
  analyzeViolations(
    violations: AxeViolation[],
    htmlContext: string
  ): Promise<ViolationAnalysis[]>;
}

export function getAiProvider(name?: AiProviderName): AiProvider {
  const provider = name || (process.env.AI_PROVIDER as AiProviderName) || "gemini";

  switch (provider) {
    case "spike":
      return new SpikeProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      return new GeminiProvider();
  }
}
