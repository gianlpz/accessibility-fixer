import { SeverityLevel } from "../lib/types";

const colours: Record<SeverityLevel, string> = {
  critical: "#dc2626",
  serious: "#ea580c",
  moderate: "#ca8a04",
  minor: "#2563eb",
};

export default function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return (
    <span
      style={{
        backgroundColor: colours[severity] + "18",
        color: colours[severity],
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {severity}
    </span>
  );
}
