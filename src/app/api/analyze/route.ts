import { getAiProvider } from "../../lib/ai-provider";
import { AxeViolation, AiProviderName } from "../../lib/types";

export async function POST(req: Request) {
  const { violations, htmlContext, provider } = (await req.json()) as {
    violations: AxeViolation[];
    htmlContext: string;
    provider?: AiProviderName;
  };

  if (!violations || violations.length === 0) {
    return Response.json({ analyses: [] });
  }

  try {
    const aiProvider = getAiProvider(provider);
    const analyses = await aiProvider.analyzeViolations(violations, htmlContext);
    return Response.json({ analyses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
