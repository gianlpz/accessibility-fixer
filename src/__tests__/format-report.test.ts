import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxeViolation, ViolationAnalysis } from "../app/lib/types";

// Mock jsPDF
vi.mock("jspdf", () => {
  const mockDoc = {
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    splitTextToSize: vi.fn((text: string) => [text]),
    addPage: vi.fn(),
    save: vi.fn(),
    internal: { pageSize: { getWidth: () => 210 } },
  };
  return { jsPDF: vi.fn(() => mockDoc) };
});

const mockViolation: AxeViolation = {
  id: "image-alt",
  impact: "critical",
  description: "Images must have alternate text",
  help: "Images must have alternate text",
  helpUrl: "https://example.com",
  tags: ["wcag2a"],
  nodes: [
    {
      html: '<img src="test.jpg">',
      target: ["img"],
      failureSummary: "No alt attribute",
    },
  ],
};

const mockAnalysis: ViolationAnalysis = {
  violationId: "image-alt",
  explanation: "Screen readers cannot describe this image.",
  fixedHtml: '<img src="test.jpg" alt="Test image">',
  originalHtml: '<img src="test.jpg">',
  wcagCriteria: ["1.1.1"],
};

describe("format-report", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exportJSON creates downloadable JSON blob", async () => {
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    const clickMock = vi.fn();

    Object.defineProperty(globalThis, "URL", {
      value: { createObjectURL, revokeObjectURL },
      writable: true,
    });

    const appendChildMock = vi.fn();
    const removeChildMock = vi.fn();
    vi.spyOn(document.body, "appendChild").mockImplementation(appendChildMock);
    vi.spyOn(document.body, "removeChild").mockImplementation(removeChildMock);

    // Mock anchor element
    const mockAnchor = {
      href: "",
      download: "",
      click: clickMock,
    };
    vi.spyOn(document, "createElement").mockReturnValue(
      mockAnchor as unknown as HTMLElement
    );

    const { exportJSON } = await import("../app/lib/format-report");

    exportJSON({
      violations: [mockViolation],
      analyses: [mockAnalysis],
      timestamp: "2026-03-13T10:00:00Z",
      passes: 5,
    });

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(mockAnchor.download).toContain("accessibility-report-");
    expect(mockAnchor.download).toContain(".json");
  });

  it("exportPDF creates a PDF document", async () => {
    const { jsPDF } = await import("jspdf");
    const { exportPDF } = await import("../app/lib/format-report");

    exportPDF({
      violations: [mockViolation],
      analyses: [mockAnalysis],
      timestamp: "2026-03-13T10:00:00Z",
      passes: 5,
    });

    const mockInstance = new jsPDF();
    expect(mockInstance.setFontSize).toHaveBeenCalled();
    expect(mockInstance.save).toHaveBeenCalled();
  });
});
