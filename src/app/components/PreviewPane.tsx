"use client";

import { useEffect, useRef } from "react";
import { AxeViolation, SeverityLevel } from "../lib/types";

const overlayColors: Record<SeverityLevel, string> = {
  critical: "rgba(220, 38, 38, 0.25)",
  serious: "rgba(234, 88, 12, 0.25)",
  moderate: "rgba(202, 138, 4, 0.25)",
  minor: "rgba(37, 99, 235, 0.25)",
};

const borderColors: Record<SeverityLevel, string> = {
  critical: "rgba(220, 38, 38, 0.8)",
  serious: "rgba(234, 88, 12, 0.8)",
  moderate: "rgba(202, 138, 4, 0.8)",
  minor: "rgba(37, 99, 235, 0.8)",
};

interface PreviewPaneProps {
  html: string;
  violations: AxeViolation[];
  showOverlay: boolean;
}

export default function PreviewPane({
  html,
  violations,
  showOverlay,
}: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!showOverlay || !iframeRef.current) return;

    const iframe = iframeRef.current;

    function applyOverlays() {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Remove previous overlays
      doc.querySelectorAll("[data-a11y-overlay]").forEach((el) => el.remove());

      violations.forEach((violation) => {
        violation.nodes.forEach((node) => {
          node.target.forEach((selector) => {
            try {
              const el = doc.querySelector(selector);
              if (!el) return;

              const rect = el.getBoundingClientRect();
              const overlay = doc.createElement("div");
              overlay.setAttribute("data-a11y-overlay", "true");
              overlay.title = `[${violation.impact.toUpperCase()}] ${violation.help}`;
              Object.assign(overlay.style, {
                position: "absolute",
                top: `${rect.top + (doc.defaultView?.scrollY || 0)}px`,
                left: `${rect.left + (doc.defaultView?.scrollX || 0)}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                backgroundColor: overlayColors[violation.impact],
                border: `2px solid ${borderColors[violation.impact]}`,
                pointerEvents: "none",
                zIndex: "10000",
                borderRadius: "2px",
              });

              // Tooltip label
              const label = doc.createElement("span");
              Object.assign(label.style, {
                position: "absolute",
                top: "-20px",
                left: "0",
                fontSize: "10px",
                fontFamily: "system-ui, sans-serif",
                backgroundColor: borderColors[violation.impact],
                color: "white",
                padding: "1px 4px",
                borderRadius: "2px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              });
              label.textContent = `${violation.impact}: ${violation.id}`;
              overlay.appendChild(label);

              doc.body.appendChild(overlay);
            } catch {
              // Selector may not match in preview
            }
          });
        });
      });
    }

    // Wait for iframe to render
    const timer = setTimeout(applyOverlays, 300);
    return () => clearTimeout(timer);
  }, [showOverlay, violations]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <iframe
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-same-origin"
        title="HTML Preview"
        className="h-96 w-full"
      />
    </div>
  );
}
