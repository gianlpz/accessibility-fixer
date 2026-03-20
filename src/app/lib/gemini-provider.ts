import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { AiProvider } from "./ai-provider";
import { buildAnalysisPrompt } from "./prompts";
import { AxeViolation, ViolationAnalysis } from "./types";

const analysisSchema = z.object({
  analyses: z.array(
    z.object({
      violationId: z.string(),
      explanation: z.string(),
      fixedHtml: z.string(),
      originalHtml: z.string(),
      wcagCriteria: z.array(z.string()),
    })
  ),
});

export class GeminiProvider implements AiProvider {
  async analyzeViolations(
    violations: AxeViolation[],
    htmlContext: string
  ): Promise<ViolationAnalysis[]> {
    const batches: AxeViolation[][] = [];
    if (violations.length > 10) {
      for (let i = 0; i < violations.length; i += 5) {
        batches.push(violations.slice(i, i + 5));
      }
    } else {
      batches.push(violations);
    }

    const allAnalyses: ViolationAnalysis[] = [];

    for (const batch of batches) {
      const prompt = buildAnalysisPrompt(batch, htmlContext);

      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: analysisSchema,
        prompt,
        temperature: 0.1,
      });

      allAnalyses.push(...object.analyses);
    }

    return allAnalyses;
  }
}
