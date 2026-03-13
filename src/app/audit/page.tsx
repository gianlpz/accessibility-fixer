"use client";

import { useState } from "react";
import Header from "../components/Header";
import HtmlInput from "../components/HtmlInput";
import ViolationList from "../components/ViolationList";
import DiffViewer from "../components/DiffViewer";
import PreviewPane from "../components/PreviewPane";
import HeatmapOverlay from "../components/HeatmapOverlay";
import ExportButton from "../components/ExportButton";
import TabNav from "../components/TabNav";
import { runAxeAudit } from "../lib/axe-runner";
import { AxeViolation, ViolationAnalysis } from "../lib/types";

const TABS = [
  { id: "violations", label: "Violations" },
  { id: "preview", label: "Preview" },
  { id: "diff", label: "Diff" },
];

export default function AuditPage() {
  const [html, setHtml] = useState("");
  const [violations, setViolations] = useState<AxeViolation[]>([]);
  const [analyses, setAnalyses] = useState<ViolationAnalysis[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("violations");
  const [isAuditing, setIsAuditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [passes, setPasses] = useState(0);
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasAudited, setHasAudited] = useState(false);

  async function handleAudit(inputHtml: string) {
    setHtml(inputHtml);
    setIsAuditing(true);
    setError(null);
    setAnalyses([]);
    setSelectedId(null);
    setHasAudited(false);

    try {
      const result = await runAxeAudit(inputHtml);
      setViolations(result.violations);
      setPasses(result.passes);
      setTimestamp(result.timestamp);
      setHasAudited(true);

      if (result.violations.length > 0) {
        setSelectedId(result.violations[0].id);
        // Start AI analysis
        setIsAnalyzing(true);
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            violations: result.violations,
            htmlContext: inputHtml,
          }),
        });

        if (!response.ok) {
          throw new Error("AI analysis failed");
        }

        const data = await response.json();
        setAnalyses(data.analyses);
        setIsAnalyzing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed");
    } finally {
      setIsAuditing(false);
    }
  }

  const selectedAnalysis = analyses.find((a) => a.violationId === selectedId);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left column: Input */}
          <div>
            <HtmlInput onAudit={handleAudit} isLoading={isAuditing} />

            {error && (
              <div
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          {/* Right column: Results */}
          <div>
            {hasAudited && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Results
                    </h2>
                    <span className="text-sm text-slate-400">
                      {violations.length} violation{violations.length !== 1 ? "s" : ""} &middot;{" "}
                      {passes} passed
                    </span>
                    {isAnalyzing && (
                      <span className="text-xs text-primary animate-pulse">
                        AI analyzing...
                      </span>
                    )}
                  </div>
                  <ExportButton
                    violations={violations}
                    analyses={analyses}
                    passes={passes}
                    timestamp={timestamp}
                  />
                </div>

                <HeatmapOverlay violations={violations} />

                <TabNav
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  tabs={TABS}
                />

                <div
                  id={`panel-${activeTab}`}
                  role="tabpanel"
                  aria-labelledby={activeTab}
                >
                  {activeTab === "violations" && (
                    <ViolationList
                      violations={violations}
                      analyses={analyses}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                    />
                  )}

                  {activeTab === "preview" && (
                    <PreviewPane
                      html={html}
                      violations={violations}
                      showOverlay={true}
                    />
                  )}

                  {activeTab === "diff" && (
                    <DiffViewer analysis={selectedAnalysis} />
                  )}
                </div>
              </div>
            )}

            {!hasAudited && !isAuditing && (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
                <div>
                  <p className="text-sm text-slate-400">
                    Paste HTML and click &ldquo;Run Audit&rdquo; to see results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
