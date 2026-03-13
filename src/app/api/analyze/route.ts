import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { buildAnalysisPrompt } from "../../lib/prompts";
import { AxeViolation } from "../../lib/types";

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

export async function POST(req: Request) {
  const { violations, htmlContext } = (await req.json()) as {
    violations: AxeViolation[];
    htmlContext: string;
  };

  if (!violations || violations.length === 0) {
    return Response.json({ analyses: [] });
  }

  // Batch violations in groups of 5 if > 10
  const batches: AxeViolation[][] = [];
  if (violations.length > 10) {
    for (let i = 0; i < violations.length; i += 5) {
      batches.push(violations.slice(i, i + 5));
    }
  } else {
    batches.push(violations);
  }

  const allAnalyses = [];

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

  return Response.json({ analyses: allAnalyses });
}
