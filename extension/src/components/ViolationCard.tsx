import { AxeViolation } from "../lib/types";
import SeverityBadge from "./SeverityBadge";

interface ViolationCardProps {
  violation: AxeViolation;
}

export default function ViolationCard({ violation }: ViolationCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <SeverityBadge severity={violation.impact} />
        <span style={{ fontWeight: 600, fontSize: "13px", color: "#1e293b" }}>
          {violation.help}
        </span>
      </div>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0" }}>
        {violation.description}
      </p>
      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
        {violation.nodes.length} element{violation.nodes.length !== 1 ? "s" : ""}{" "}
        affected
      </div>
      {violation.nodes.slice(0, 3).map((node, i) => (
        <pre
          key={i}
          style={{
            fontSize: "10px",
            backgroundColor: "#f8fafc",
            padding: "6px 8px",
            borderRadius: "4px",
            marginTop: "4px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {node.html}
        </pre>
      ))}
      <a
        href={violation.helpUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "11px", color: "#6366f1", marginTop: "6px", display: "inline-block" }}
      >
        Learn more →
      </a>
    </div>
  );
}
