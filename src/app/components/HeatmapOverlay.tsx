"use client";

import { AxeViolation, SeverityLevel } from "../lib/types";

const severityCounts = (violations: AxeViolation[]) => {
  const counts: Record<SeverityLevel, number> = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };
  violations.forEach((v) => counts[v.impact]++);
  return counts;
};

interface HeatmapOverlayProps {
  violations: AxeViolation[];
}

export default function HeatmapOverlay({ violations }: HeatmapOverlayProps) {
  const counts = severityCounts(violations);

  return (
    <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-4 py-2 text-xs">
      <span className="font-medium text-slate-500">Summary:</span>
      {counts.critical > 0 && (
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-critical" />
          <span className="text-critical font-medium">{counts.critical} critical</span>
        </span>
      )}
      {counts.serious > 0 && (
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-serious" />
          <span className="text-serious font-medium">{counts.serious} serious</span>
        </span>
      )}
      {counts.moderate > 0 && (
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-moderate" />
          <span className="text-moderate font-medium">{counts.moderate} moderate</span>
        </span>
      )}
      {counts.minor > 0 && (
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-minor" />
          <span className="text-minor font-medium">{counts.minor} minor</span>
        </span>
      )}
      {violations.length === 0 && (
        <span className="text-green-600 font-medium">All clear!</span>
      )}
    </div>
  );
}
