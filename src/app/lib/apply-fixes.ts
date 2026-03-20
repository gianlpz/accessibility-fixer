import { ViolationAnalysis } from "./types";

/**
 * Apply AI-generated fixes to the original HTML.
 * For each analysis, replaces the originalHtml snippet with fixedHtml.
 */
export function applyFixes(
  html: string,
  analyses: ViolationAnalysis[]
): string {
  let result = html;

  for (const analysis of analyses) {
    if (!analysis.originalHtml || !analysis.fixedHtml) continue;
    if (analysis.originalHtml === analysis.fixedHtml) continue;

    // Only replace the first occurrence to avoid unintended changes
    const index = result.indexOf(analysis.originalHtml);
    if (index === -1) continue;

    result =
      result.slice(0, index) +
      analysis.fixedHtml +
      result.slice(index + analysis.originalHtml.length);
  }

  return result;
}
