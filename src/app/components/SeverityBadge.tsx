import { SeverityLevel } from "../lib/types";

const severityStyles: Record<SeverityLevel, string> = {
  critical: "bg-red-100 text-critical border-red-200",
  serious: "bg-orange-100 text-serious border-orange-200",
  moderate: "bg-yellow-100 text-moderate border-yellow-200",
  minor: "bg-blue-100 text-minor border-blue-200",
};

const severityLabels: Record<SeverityLevel, string> = {
  critical: "Critical",
  serious: "Serious",
  moderate: "Moderate",
  minor: "Minor",
};

interface SeverityBadgeProps {
  severity: SeverityLevel;
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${severityStyles[severity]}`}
    >
      {severityLabels[severity]}
    </span>
  );
}
