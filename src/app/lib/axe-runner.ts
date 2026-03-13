import { AxeViolation, AuditResult, SeverityLevel } from "./types";

export async function runAxeAudit(html: string): Promise<AuditResult> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    iframe.onload = async () => {
      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) {
          throw new Error("Cannot access iframe document");
        }

        // Load axe-core into the iframe
        const script = iframeDoc.createElement("script");
        script.src = "/axe.min.js";

        await new Promise<void>((res, rej) => {
          script.onload = () => res();
          script.onerror = () => rej(new Error("Failed to load axe-core"));
          iframeDoc.head.appendChild(script);
        });

        // Run axe
        const iframeWindow = iframe.contentWindow as Window & {
          axe: { run: (doc: Document) => Promise<{ violations: unknown[]; passes: unknown[] }> };
        };
        const results = await iframeWindow.axe.run(iframeDoc);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const violations: AxeViolation[] = (results.violations as any[]).map(
          (v) => ({
            id: v.id as string,
            impact: (v.impact as SeverityLevel) || "minor",
            description: v.description as string,
            help: v.help as string,
            helpUrl: v.helpUrl as string,
            tags: v.tags as string[],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodes: (v.nodes as any[]).map((n) => ({
              html: n.html as string,
              target: n.target as string[],
              failureSummary: n.failureSummary as string,
            })),
          })
        );

        document.body.removeChild(iframe);

        resolve({
          violations,
          passes: results.passes.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        document.body.removeChild(iframe);
        reject(error);
      }
    };

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      reject(new Error("Failed to load HTML into iframe"));
    };
  });
}
