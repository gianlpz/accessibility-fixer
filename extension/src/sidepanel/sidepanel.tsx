import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import ViolationCard from "../components/ViolationCard";
import { AuditResult, SeverityLevel } from "../lib/types";

const SEVERITY_ORDER: SeverityLevel[] = [
  "critical",
  "serious",
  "moderate",
  "minor",
];

function SidePanel() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    // Load initial data
    chrome.storage.session.get(["auditResult", "auditStatus"], (data) => {
      if (data.auditResult) {
        setResult(data.auditResult);
      }
      if (data.auditStatus) {
        setStatus(data.auditStatus);
      }
    });

    // Listen for updates
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.auditResult?.newValue) {
        setResult(changes.auditResult.newValue);
      }
      if (changes.auditStatus?.newValue) {
        setStatus(changes.auditStatus.newValue);
      }
    };

    chrome.storage.session.onChanged.addListener(listener);
    return () => chrome.storage.session.onChanged.removeListener(listener);
  }, []);

  if (status === "running" && !result) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: "14px", color: "#6366f1", fontWeight: 600 }}>
          Auditing page...
        </p>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
          Running axe-core accessibility checks
        </p>
      </div>
    );
  }

  if (status === "error" && !result) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#dc2626", fontWeight: 600 }}>
          Audit failed
        </p>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
          Try right-clicking the page and auditing again.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>
          No audit results yet. Right-click a page and select &quot;Audit this
          page for accessibility&quot;.
        </p>
      </div>
    );
  }

  const sorted = [...result.violations].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.impact) - SEVERITY_ORDER.indexOf(b.impact)
  );

  function handleSendToApp() {
    chrome.runtime.sendMessage({
      type: "SEND_TO_APP",
      appUrl: "http://localhost:3000",
    });
  }

  return (
    <div style={{ padding: "12px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          padding: "8px 0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
            Audit Results
          </h1>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            {result.pageTitle}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: result.violations.length > 0 ? "#dc2626" : "#16a34a",
            }}
          >
            {result.violations.length}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            violation{result.violations.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <button
        onClick={handleSendToApp}
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "12px",
        }}
      >
        Send to App for AI Analysis
      </button>

      <div>
        {sorted.map((violation, i) => (
          <ViolationCard key={`${violation.id}-${i}`} violation={violation} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "#16a34a",
            fontSize: "14px",
          }}
        >
          No accessibility violations found!
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<SidePanel />);
