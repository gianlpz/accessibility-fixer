import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import SeverityBadge from "../components/SeverityBadge";
import { AuditResult, SeverityLevel } from "../lib/types";

function Popup() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    chrome.storage.session.get("auditResult", (data) => {
      if (data.auditResult) {
        setResult(data.auditResult);
      }
    });
  }, []);

  async function handleAudit() {
    setIsAuditing(true);
    chrome.runtime.sendMessage({ type: "RUN_AUDIT" }, () => {
      // Result will be stored in session storage
      setTimeout(() => {
        chrome.storage.session.get("auditResult", (data) => {
          if (data.auditResult) {
            setResult(data.auditResult);
          }
          setIsAuditing(false);
        });
      }, 2000);
    });
  }

  function handleSendToApp() {
    chrome.runtime.sendMessage({
      type: "SEND_TO_APP",
      appUrl: "http://localhost:3000",
    });
  }

  const severityCounts: Record<SeverityLevel, number> = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };

  result?.violations.forEach((v) => {
    severityCounts[v.impact]++;
  });

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "20px" }}>♿</span>
        <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
          Accessibility Fixer
        </h1>
      </div>

      <button
        onClick={handleAudit}
        disabled={isAuditing}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: isAuditing ? "#94a3b8" : "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: isAuditing ? "not-allowed" : "pointer",
          marginBottom: "12px",
        }}
      >
        {isAuditing ? "Auditing..." : "Audit This Page"}
      </button>

      {result && (
        <>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              {result.pageTitle}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: result.violations.length > 0 ? "#dc2626" : "#16a34a",
              }}
            >
              {result.violations.length} violation
              {result.violations.length !== 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              {result.passes} checks passed
            </div>

            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {(
                Object.entries(severityCounts) as [SeverityLevel, number][]
              ).map(
                ([level, count]) =>
                  count > 0 && (
                    <div
                      key={level}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <SeverityBadge severity={level} />
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {count}
                      </span>
                    </div>
                  )
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => chrome.sidePanel.open({})}
              style={{
                flex: 1,
                padding: "8px",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                color: "#475569",
              }}
            >
              View Details
            </button>
            <button
              onClick={handleSendToApp}
              style={{
                flex: 1,
                padding: "8px",
                backgroundColor: "#6366f1",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                color: "white",
              }}
            >
              Send to App
            </button>
          </div>
        </>
      )}

      {!result && !isAuditing && (
        <p
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            textAlign: "center",
            padding: "8px 0",
          }}
        >
          Click &quot;Audit This Page&quot; to scan for accessibility issues
        </p>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
