"use client";

import { AxeViolation, ViolationAnalysis } from "../lib/types";
import ViolationCard from "./ViolationCard";

const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };

interface ViolationListProps {
  violations: AxeViolation[];
  analyses: ViolationAnalysis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ViolationList({
  violations,
  analyses,
  selectedId,
  onSelect,
}: ViolationListProps) {
  const sorted = [...violations].sort(
    (a, b) => severityOrder[a.impact] - severityOrder[b.impact]
  );

  if (violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h3 className="mt-3 text-lg font-semibold text-green-800">
          No violations found!
        </h3>
        <p className="mt-1 text-sm text-green-600">
          Your HTML passes all axe-core accessibility checks.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "60vh" }}>
      {sorted.map((violation) => (
        <ViolationCard
          key={violation.id}
          violation={violation}
          analysis={analyses.find((a) => a.violationId === violation.id)}
          isSelected={selectedId === violation.id}
          onSelect={() => onSelect(violation.id)}
        />
      ))}
    </div>
  );
}
