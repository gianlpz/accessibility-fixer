import { AxeViolation, SeverityLevel, UrlScanResult } from "./types";

const PRIVATE_IP_PATTERNS = [
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/10\./,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/0\.0\.0\.0/,
  /^https?:\/\/\[::1\]/,
];

export class UrlScanError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "UrlScanError";
  }
}

/**
 * Validate a URL for scanning. Rejects non-http(s) and private/internal URLs.
 */
export function validateUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new UrlScanError(
        "Please enter a valid URL starting with http:// or https://",
        400
      );
    }
  } catch (e) {
    if (e instanceof UrlScanError) throw e;
    throw new UrlScanError(
      "Please enter a valid URL starting with http:// or https://",
      400
    );
  }

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(url)) {
      throw new UrlScanError("Cannot scan private or internal URLs", 400);
    }
  }
}

/**
 * Scan a URL using Browserless.io's /function endpoint.
 * Injects axe-core, runs audit, captures rendered HTML.
 */
export async function scanUrl(url: string): Promise<UrlScanResult> {
  const apiKey = process.env.BROWSERLESS_API_KEY;
  if (!apiKey) {
    throw new UrlScanError("URL scanning is not configured", 500);
  }

  validateUrl(url);

  const browserlessUrl = `https://production-sfo.browserless.io/function?token=${apiKey}`;

  const functionCode = `
    export default async function ({ page }) {
      await page.goto("${url.replace(/"/g, '\\"')}", {
        waitUntil: "networkidle0",
        timeout: 20000,
      });

      // Inject axe-core from CDN
      await page.addScriptTag({
        url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js",
      });

      // Run axe audit + inline CSS and rewrite image URLs
      const results = await page.evaluate(async () => {
        const axeResults = await window.axe.run(document);

        // Inline same-origin stylesheets
        Array.from(document.styleSheets).forEach((sheet) => {
          try {
            const cssText = Array.from(sheet.cssRules)
              .map((r) => r.cssText)
              .join("\\n");
            const style = document.createElement("style");
            style.setAttribute("data-inlined", "true");
            style.textContent = cssText;
            document.head.appendChild(style);
          } catch {
            // Cross-origin sheets throw SecurityError — skip
          }
        });

        // Rewrite image src to absolute URLs
        document.querySelectorAll("img[src]").forEach((el) => {
          el.setAttribute("src", el.src);
        });

        const html = document.documentElement.outerHTML;
        return {
          violations: axeResults.violations,
          passes: axeResults.passes.length,
          html,
        };
      });

      // Capture screenshot
      const screenshotBuffer = await page.screenshot({ type: "jpeg", quality: 60, encoding: "base64" });
      const screenshot = "data:image/jpeg;base64," + screenshotBuffer;

      return { ...results, screenshot };
    }
  `;

  let response: Response;
  try {
    response = await fetch(browserlessUrl, {
      method: "POST",
      headers: { "Content-Type": "application/javascript" },
      body: functionCode,
      signal: AbortSignal.timeout(25000),
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "TimeoutError") {
      throw new UrlScanError(
        "Page took too long to load. Try pasting the HTML directly.",
        504
      );
    }
    throw new UrlScanError(
      "Failed to connect to scanning service",
      502
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    if (response.status === 408 || text.includes("timeout")) {
      throw new UrlScanError(
        "Page took too long to load. Try pasting the HTML directly.",
        504
      );
    }
    throw new UrlScanError(
      `Scanning service error: ${response.status}`,
      502
    );
  }

  const data = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const violations: AxeViolation[] = (data.violations || []).map((v: any) => ({
    id: v.id as string,
    impact: (v.impact as SeverityLevel) || "minor",
    description: v.description as string,
    help: v.help as string,
    helpUrl: v.helpUrl as string,
    tags: v.tags as string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: (v.nodes || []).map((n: any) => ({
      html: n.html as string,
      target: n.target as string[],
      failureSummary: n.failureSummary as string,
    })),
  }));

  return {
    violations,
    passes: data.passes || 0,
    timestamp: new Date().toISOString(),
    html: data.html || "",
    scannedUrl: url,
    screenshot: data.screenshot || undefined,
  };
}
