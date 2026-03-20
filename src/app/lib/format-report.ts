import { jsPDF } from "jspdf";
import { AxeViolation, ViolationAnalysis } from "./types";

interface ReportData {
  violations: AxeViolation[];
  analyses: ViolationAnalysis[];
  timestamp: string;
  passes: number;
  scannedUrl?: string;
  contrastSummary?: { total: number; failing: number };
}

export function exportJSON(data: ReportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, `accessibility-report-${formatDate(data.timestamp)}.json`);
}

export function exportPDF(data: ReportData): void {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Accessibility Audit Report", margin, y);
  y += 10;

  // Metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date(data.timestamp).toLocaleString()}`, margin, y);
  y += 6;
  doc.text(`Violations: ${data.violations.length} | Passes: ${data.passes}`, margin, y);
  y += 6;
  if (data.scannedUrl) {
    doc.text(`Scanned URL: ${data.scannedUrl}`, margin, y);
    y += 6;
  }
  y += 6;

  // Severity Summary
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Severity Summary", margin, y);
  y += 8;

  const severityCounts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  data.violations.forEach((v) => {
    severityCounts[v.impact]++;
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  for (const [level, count] of Object.entries(severityCounts)) {
    if (count > 0) {
      doc.text(`${level.charAt(0).toUpperCase() + level.slice(1)}: ${count}`, margin + 4, y);
      y += 6;
    }
  }
  y += 8;

  // Contrast Summary
  if (data.contrastSummary) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Colour Contrast", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${data.contrastSummary.total} colour pairs analyzed, ${data.contrastSummary.failing} failing WCAG AA`,
      margin + 4,
      y
    );
    y += 10;
  }

  // Violations
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Violations", margin, y);
  y += 8;

  data.violations.forEach((violation, i) => {
    const analysis = data.analyses.find((a) => a.violationId === violation.id);

    if (y > 260) {
      doc.addPage();
      y = margin;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${i + 1}. [${violation.impact.toUpperCase()}] ${violation.help}`,
      margin,
      y
    );
    y += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const descLines = doc.splitTextToSize(violation.description, contentWidth - 8);
    doc.text(descLines, margin + 4, y);
    y += descLines.length * 4 + 2;

    if (analysis) {
      const explLines = doc.splitTextToSize(
        `Explanation: ${analysis.explanation}`,
        contentWidth - 8
      );
      doc.text(explLines, margin + 4, y);
      y += explLines.length * 4 + 2;

      if (analysis.wcagCriteria.length > 0) {
        doc.text(`WCAG: ${analysis.wcagCriteria.join(", ")}`, margin + 4, y);
        y += 6;
      }
    }

    y += 4;
  });

  doc.save(`accessibility-report-${formatDate(data.timestamp)}.pdf`);
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
