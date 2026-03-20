"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { AxeViolation, ViolationAnalysis, SeverityLevel } from "../lib/types";
import { applyFixes } from "../lib/apply-fixes";

const borderColors: Record<SeverityLevel, string> = {
  critical: "#dc2626",
  serious: "#ea580c",
  moderate: "#ca8a04",
  minor: "#2563eb",
};

// Plain-language descriptions for common axe rule IDs
const friendlyLabels: Record<string, string> = {
  "image-alt": "Missing image description",
  "button-name": "Button has no label",
  "link-name": "Link has no label",
  "label": "Form input missing label",
  "select-name": "Dropdown missing label",
  "color-contrast": "Text hard to read (low contrast)",
  "heading-order": "Heading levels skipped",
  "html-has-lang": "Page language not set",
  "document-title": "Page has no title",
  "region": "Content not in a landmark section",
  "landmark-one-main": "No main content area defined",
  "page-has-heading-one": "Page missing a main heading",
  "marquee": "Moving text (marquee) is not accessible",
  "meta-viewport": "Zoom is disabled",
  "aria-required-attr": "Missing required ARIA attribute",
  "aria-valid-attr-value": "Invalid ARIA value",
  "duplicate-id": "Duplicate element ID found",
  "list": "List structure is incorrect",
  "listitem": "List item outside a list",
  "td-headers-attr": "Table header mismatch",
  "frame-title": "Frame missing a title",
};

function getFriendlyLabel(violation: AxeViolation): string {
  return friendlyLabels[violation.id] || violation.help;
}

type PreviewMode = "visual" | "interactive";

interface PreviewPaneProps {
  html: string;
  violations: AxeViolation[];
  showOverlay: boolean;
  screenshot?: string;
  analyses?: ViolationAnalysis[];
}

export default function PreviewPane({
  html,
  violations,
  showOverlay,
  screenshot,
  analyses,
}: PreviewPaneProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>(
    screenshot ? "visual" : "interactive"
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const hasFixedHtml = analyses && analyses.length > 0;
  const fixedHtml = useMemo(
    () => (hasFixedHtml ? applyFixes(html, analyses) : html),
    [html, analyses, hasFixedHtml]
  );

  // Update default mode when screenshot availability changes
  useEffect(() => {
    setPreviewMode(screenshot ? "visual" : "interactive");
  }, [screenshot]);

  useEffect(() => {
    if (previewMode !== "interactive" || !showOverlay || !iframeRef.current)
      return;

    const iframe = iframeRef.current;

    function applyOverlays() {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;

      // Remove previous overlays and spacer
      doc.querySelectorAll("[data-a11y-overlay]").forEach((el) => el.remove());

      // Add top spacer so overlay labels near the top aren't clipped by the iframe
      if (!doc.getElementById("a11y-spacer")) {
        const spacer = doc.createElement("div");
        spacer.id = "a11y-spacer";
        spacer.style.height = "24px";
        doc.body.insertBefore(spacer, doc.body.firstChild);
      }

      // Track which elements already have an overlay to avoid stacking
      const highlightedElements = new Set<Element>();
      // Track which violation types already have a label shown
      const labeledViolations = new Set<string>();

      violations.forEach((violation) => {
        // For "region" violations, only highlight the first node — not every child
        const maxNodes = violation.id === "region" ? 1 : violation.nodes.length;
        const nodesToShow = violation.nodes.slice(0, maxNodes);

        nodesToShow.forEach((node) => {
          // Use only the first (most specific) selector
          const selector = node.target[0];
          if (!selector) return;

          try {
            const el = doc.querySelector(selector);
            if (!el || highlightedElements.has(el)) return;

            // Skip body/html-level elements — they create full-page overlays
            if (el === doc.body || el === doc.documentElement) return;

            highlightedElements.add(el);

            const rect = el.getBoundingClientRect();
            // Skip elements with no visible size
            if (rect.width === 0 && rect.height === 0) return;

            const color = borderColors[violation.impact];
            const overlay = doc.createElement("div");
            overlay.setAttribute("data-a11y-overlay", "true");
            Object.assign(overlay.style, {
              position: "absolute",
              top: `${rect.top + (doc.defaultView?.scrollY || 0)}px`,
              left: `${rect.left + (doc.defaultView?.scrollX || 0)}px`,
              width: `${rect.width}px`,
              height: `${Math.max(rect.height, 4)}px`,
              backgroundColor: "transparent",
              border: `2px dashed ${color}`,
              pointerEvents: "none",
              zIndex: "10000",
              borderRadius: "4px",
            });

            // Only show one label per violation type
            if (!labeledViolations.has(violation.id)) {
              labeledViolations.add(violation.id);

              const label = doc.createElement("span");
              const friendly = getFriendlyLabel(violation);
              // If the element is near the top, place label inside instead of above
              const overlayTop = rect.top + (doc.defaultView?.scrollY || 0);
              const labelAbove = overlayTop >= 22;
              Object.assign(label.style, {
                position: "absolute",
                top: labelAbove ? "-20px" : "0px",
                left: "0",
                fontSize: "9px",
                fontFamily: "system-ui, sans-serif",
                backgroundColor: color,
                color: "white",
                padding: "2px 8px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                lineHeight: "1.4",
              });
              label.textContent = friendly;
              overlay.appendChild(label);
            }

            doc.body.appendChild(overlay);
          } catch {
            // Selector may not match in preview
          }
        });
      });
    }

    // Listen for iframe load event instead of using a fixed timeout
    const handleLoad = () => applyOverlays();
    iframe.addEventListener("load", handleLoad);

    // Also apply immediately if iframe is already loaded (e.g. same srcdoc re-render)
    if (iframe.contentDocument?.readyState === "complete" && iframe.contentDocument?.body) {
      applyOverlays();
    }

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [previewMode, showOverlay, violations, html]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      {screenshot && (
        <div className="flex border-b border-border">
          <button
            onClick={() => setPreviewMode("visual")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              previewMode === "visual"
                ? "bg-primary text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setPreviewMode("interactive")}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              previewMode === "interactive"
                ? "bg-primary text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Interactive
          </button>
        </div>
      )}

      {previewMode === "visual" && screenshot ? (
        <div className="h-96 overflow-auto">
          <img
            src={screenshot}
            alt="Page screenshot at audit time"
            className="w-full"
          />
        </div>
      ) : hasFixedHtml ? (
        <div className="grid grid-cols-2 gap-0">
          <div className="border-r border-border">
            <div className="flex items-center gap-2 border-b border-border bg-red-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-700">Before</span>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={html}
              sandbox="allow-same-origin"
              title="Original HTML with violations"
              className="h-96 w-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 border-b border-border bg-green-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-700">After (Fixed)</span>
            </div>
            <iframe
              srcDoc={fixedHtml}
              sandbox="allow-same-origin"
              title="Fixed HTML preview"
              className="h-96 w-full"
            />
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          srcDoc={html}
          sandbox="allow-same-origin"
          title="HTML Preview"
          className="h-96 w-full"
        />
      )}
    </div>
  );
}
