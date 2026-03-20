export const accessibilityPrd = {
  name: "WCAG Access4U",
  constraints: [
    "All analysis must target WCAG 2.2 Level AA compliance",
    "Fixes must be minimal — change only what is needed to resolve each violation",
    "Explanations must use plain language, no jargon",
    "All corrected HTML must be valid HTML5",
    "Use ARIA attributes only when native HTML semantics are insufficient",
    "Never remove existing functionality or content when fixing violations",
  ],
  acceptance_criteria: [
    "Each violation includes a plain-language explanation (2-3 sentences)",
    "Each violation includes corrected HTML that resolves the issue",
    "Each violation maps to specific WCAG success criteria (e.g. 1.1.1, 4.1.2)",
    "Original HTML is preserved exactly as provided for diff comparison",
    "Response is valid JSON matching the expected schema",
  ],
};
