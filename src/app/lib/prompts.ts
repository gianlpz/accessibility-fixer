import { AxeViolation } from "./types";

export function buildAnalysisPrompt(
  violations: AxeViolation[],
  htmlContext: string
): string {
  const violationDescriptions = violations
    .map(
      (v, i) =>
        `Violation ${i + 1} (ID: ${v.id}, Severity: ${v.impact}):
  Description: ${v.description}
  Help: ${v.help}
  WCAG Tags: ${v.tags.filter((t) => t.startsWith("wcag")).join(", ")}
  Affected elements:
${v.nodes.map((n) => `    HTML: ${n.html}\n    Issue: ${n.failureSummary}`).join("\n")}`
    )
    .join("\n\n");

  return `You are an accessibility expert. Analyze these WCAG violations and provide fixes.

For each violation, provide:
1. A plain-language explanation of why this is a problem (2-3 sentences, no jargon)
2. The corrected HTML that fixes the issue
3. The original HTML (exactly as provided)
4. The relevant WCAG success criteria

Here is the full HTML context:
\`\`\`html
${htmlContext}
\`\`\`

Violations to fix:
${violationDescriptions}

Return structured JSON matching the schema. Make fixes minimal — change only what's needed to resolve each violation.`;
}
