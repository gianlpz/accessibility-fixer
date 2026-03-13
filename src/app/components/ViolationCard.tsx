"use client";

import { useState } from "react";
import { AxeViolation, ViolationAnalysis } from "../lib/types";
import SeverityBadge from "./SeverityBadge";

interface ViolationCardProps {
  violation: AxeViolation;
  analysis?: ViolationAnalysis;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ViolationCard({
  violation,
  analysis,
  isSelected,
  onSelect,
}: ViolationCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyFix() {
    if (analysis?.fixedHtml) {
      await navigator.clipboard.writeText(analysis.fixedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`cursor-pointer rounded-lg border p-4 transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-white hover:border-slate-300"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">{violation.help}</h3>
        <SeverityBadge severity={violation.impact} />
      </div>

      <p className="mb-3 text-xs text-slate-500">{violation.description}</p>

      {violation.nodes.length > 0 && (
        <div className="mb-3 rounded bg-slate-50 p-2">
          <code className="block overflow-x-auto text-xs text-slate-600">
            {violation.nodes[0].html}
          </code>
        </div>
      )}

      {analysis && isSelected && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          <div>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Explanation
            </h4>
            <p className="text-sm text-slate-700">{analysis.explanation}</p>
          </div>

          {analysis.wcagCriteria.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {analysis.wcagCriteria.map((c) => (
                <span
                  key={c}
                  className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyFix();
              }}
              className="rounded bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {copied ? "Copied!" : "Copy Fix"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
