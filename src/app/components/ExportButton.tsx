"use client";

import { AxeViolation, ViolationAnalysis } from "../lib/types";
import { exportJSON, exportPDF } from "../lib/format-report";

interface ExportButtonProps {
  violations: AxeViolation[];
  analyses: ViolationAnalysis[];
  passes: number;
  timestamp: string;
}

export default function ExportButton({
  violations,
  analyses,
  passes,
  timestamp,
}: ExportButtonProps) {
  const data = { violations, analyses, timestamp, passes };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportJSON(data)}
        disabled={violations.length === 0}
        className="rounded border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export JSON
      </button>
      <button
        onClick={() => exportPDF(data)}
        disabled={violations.length === 0}
        className="rounded border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Export PDF
      </button>
    </div>
  );
}
