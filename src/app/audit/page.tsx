"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import HtmlInput from "../components/HtmlInput";
import UrlInput from "../components/UrlInput";
import InputModeTabs from "../components/InputModeTabs";
import ViolationList from "../components/ViolationList";
import DiffViewer from "../components/DiffViewer";
import PreviewPane from "../components/PreviewPane";
import HeatmapOverlay from "../components/HeatmapOverlay";
import ExportButton from "../components/ExportButton";
import TabNav from "../components/TabNav";
import ContrastMatrix from "../components/ContrastMatrix";
import { runAxeAudit } from "../lib/axe-runner";
import { extractColourPairs } from "../lib/colour-extractor";
import {
  AxeViolation,
  ViolationAnalysis,
  InputMode,
  AiProviderName,
  ContrastMatrixResult,
} from "../lib/types";

const TABS = [
  { id: "violations", label: "Violations" },
  { id: "preview", label: "Preview" },
  { id: "diff", label: "Diff" },
  { id: "contrast", label: "Contrast" },
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
  const [inputMode, setInputMode] = useState<InputMode>("html");
  const [scannedUrl, setScannedUrl] = useState<string | undefined>();
  const [contrastResult, setContrastResult] =
    useState<ContrastMatrixResult | null>(null);
  const [screenshot, setScreenshot] = useState<string | undefined>();
  const [aiProvider, setAiProvider] = useState<AiProviderName>("gemini");

  // Check for imported data from the browser extension
  useEffect(() => {
    const imported = sessionStorage.getItem("a11y-import");
    if (imported) {
      sessionStorage.removeItem("a11y-import");
      try {
        const data = JSON.parse(imported);
        setViolations(data.violations || []);
        setPasses(data.passes || 0);
        setHtml(data.html || "");
        setScreenshot(data.screenshot || undefined);
        setScannedUrl(data.scannedUrl || undefined);
        setTimestamp(new Date().toISOString());
        setHasAudited(true);
        if (data.violations?.length > 0) {
          setSelectedId(data.violations[0].id);
          // Run AI analysis on imported violations
          setIsAnalyzing(true);
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              violations: data.violations,
              htmlContext: (data.html || "").slice(0, 10000),
              provider: aiProvider,
            }),
          })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((result) => {
              setAnalyses(result.analyses);
              setIsAnalyzing(false);
            })
            .catch(() => setIsAnalyzing(false));
        }
        if (data.html) {
          setTimeout(() => extractContrastFromHtml(data.html), 500);
        }
      } catch {
        // Invalid import data, ignore
      }
    }
  }, []);

  async function handleAudit(inputHtml: string) {
    setHtml(inputHtml);
    setIsAuditing(true);
    setError(null);
    setAnalyses([]);
    setSelectedId(null);
    setHasAudited(false);
    setScannedUrl(undefined);
    setScreenshot(undefined);
    setContrastResult(null);

    try {
      const result = await runAxeAudit(inputHtml);
      setViolations(result.violations);
      setPasses(result.passes);
      setTimestamp(result.timestamp);
      setHasAudited(true);

      // Extract colour pairs after a short delay (iframe needs to render)
      setTimeout(() => {
        extractContrastFromHtml(inputHtml);
      }, 500);

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
            provider: aiProvider,
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

  async function handleUrlScan(url: string) {
    setIsAuditing(true);
    setError(null);
    setAnalyses([]);
    setSelectedId(null);
    setHasAudited(false);
    setScreenshot(undefined);
    setContrastResult(null);

    try {
      const response = await fetch("/api/scan-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "URL scan failed");
      }

      setHtml(data.html);
      setViolations(data.violations);
      setPasses(data.passes);
      setTimestamp(data.timestamp);
      setScannedUrl(data.scannedUrl);
      setScreenshot(data.screenshot || undefined);
      setHasAudited(true);

      // Extract colour pairs after iframe renders
      setTimeout(() => {
        extractContrastFromHtml(data.html);
      }, 500);

      if (data.violations.length > 0) {
        setSelectedId(data.violations[0].id);
        // Start AI analysis
        setIsAnalyzing(true);
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            violations: data.violations,
            htmlContext: data.html.slice(0, 10000),
            provider: aiProvider,
          }),
        });

        if (!analyzeResponse.ok) {
          throw new Error("AI analysis failed");
        }

        const analyzeData = await analyzeResponse.json();
        setAnalyses(analyzeData.analyses);
        setIsAnalyzing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "URL scan failed");
    } finally {
      setIsAuditing(false);
    }
  }

  function extractContrastFromHtml(htmlContent: string) {
    // Create a temporary hidden iframe to extract colours
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.srcdoc = htmlContent;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          const result = extractColourPairs(doc);
          setContrastResult(result);
        }
      } catch {
        // Colour extraction is best-effort
      } finally {
        document.body.removeChild(iframe);
      }
    };
  }

  const selectedAnalysis = analyses.find((a) => a.violationId === selectedId);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left column: Input */}
          <div>
            <InputModeTabs mode={inputMode} onChange={setInputMode} />

            <div className="mt-3 flex items-center gap-2">
              <label
                htmlFor="ai-provider"
                className="text-sm font-medium text-slate-600"
              >
                AI Provider
              </label>
              <select
                id="ai-provider"
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as AiProviderName)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="gemini">Gemini</option>
                <option value="spike">Spike.land PRD Filter</option>
              </select>
            </div>

            {inputMode === "html" ? (
              <HtmlInput onAudit={handleAudit} isLoading={isAuditing} />
            ) : (
              <UrlInput onScan={handleUrlScan} isLoading={isAuditing} />
            )}

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
                    {scannedUrl && (
                      <span className="truncate text-xs text-primary" title={scannedUrl}>
                        {scannedUrl}
                      </span>
                    )}
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
                    scannedUrl={scannedUrl}
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
                      screenshot={screenshot}
                      analyses={analyses}
                    />
                  )}

                  {activeTab === "diff" && (
                    <DiffViewer analysis={selectedAnalysis} />
                  )}

                  {activeTab === "contrast" && (
                    contrastResult ? (
                      <ContrastMatrix result={contrastResult} />
                    ) : (
                      <p className="text-sm text-slate-400">
                        Extracting colour pairs...
                      </p>
                    )
                  )}
                </div>
              </div>
            )}

            {!hasAudited && !isAuditing && (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
                <div>
                  <p className="text-sm text-slate-400">
                    {inputMode === "html"
                      ? 'Paste HTML and click "Run Audit" to see results'
                      : 'Enter a URL and click "Scan URL" to see results'}
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
