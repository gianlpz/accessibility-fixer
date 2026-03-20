import { z } from "zod";
import { AiProvider } from "./ai-provider";
import { buildAnalysisPrompt } from "./prompts";
import { accessibilityPrd } from "./prd-filter";
import { AxeViolation, ViolationAnalysis } from "./types";

const analysisItemSchema = z.object({
  violationId: z.string(),
  explanation: z.string(),
  fixedHtml: z.string(),
  originalHtml: z.string(),
  wcagCriteria: z.array(z.string()),
});

const analysisResponseSchema = z.object({
  analyses: z.array(analysisItemSchema),
});

export class SpikeProvider implements AiProvider {
  private apiKey: string;

  constructor() {
    const key = process.env.SPIKE_LAND_API_KEY;
    if (!key) {
      throw new Error(
        "SPIKE_LAND_API_KEY is not set. Add it to your .env.local file."
      );
    }
    this.apiKey = key;
  }

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

      const jsonInstruction = `

IMPORTANT: Respond with ONLY valid JSON in this exact format:
{
  "analyses": [
    {
      "violationId": "the-violation-id",
      "explanation": "plain language explanation",
      "fixedHtml": "<corrected html>",
      "originalHtml": "<original html>",
      "wcagCriteria": ["1.1.1"]
    }
  ]
}`;

      const response = await fetch("https://api.spike.land/v1/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "smart",
          prompt: prompt + jsonInstruction,
          prd_filter: accessibilityPrd,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`spike.land API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // spike.land returns free-form JSON — extract and validate
      const content = typeof data.response === "string" ? data.response : JSON.stringify(data);
      const parsed = this.extractJson(content);
      const result = analysisResponseSchema.safeParse(parsed);

      if (!result.success) {
        throw new Error(
          `spike.land returned invalid response format: ${result.error.message}`
        );
      }

      allAnalyses.push(...result.data.analyses);
    }

    return allAnalyses;
  }

  private extractJson(text: string): unknown {
    // Try parsing directly first
    try {
      return JSON.parse(text);
    } catch {
      // Try extracting JSON from markdown code block
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        return JSON.parse(match[1].trim());
      }
      // Try finding JSON object in the text
      const braceMatch = text.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        return JSON.parse(braceMatch[0]);
      }
      throw new Error("Could not extract JSON from spike.land response");
    }
  }
}
