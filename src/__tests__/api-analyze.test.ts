import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the AI SDK
vi.mock("@ai-sdk/google", () => ({
  google: vi.fn(() => "mock-model"),
}));

vi.mock("ai", () => ({
  generateObject: vi.fn(async () => ({
    object: {
      analyses: [
        {
          violationId: "image-alt",
          explanation: "Images need alt text for screen readers.",
          fixedHtml: '<img src="test.jpg" alt="Description">',
          originalHtml: '<img src="test.jpg">',
          wcagCriteria: ["1.1.1"],
        },
      ],
    },
  })),
}));

describe("API /api/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty analyses for empty violations", async () => {
    const { POST } = await import("../app/api/analyze/route");

    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ violations: [], htmlContext: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.analyses).toEqual([]);
  });

  it("returns analyses for violations", async () => {
    const { POST } = await import("../app/api/analyze/route");

    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        violations: [
          {
            id: "image-alt",
            impact: "critical",
            description: "Images must have alt text",
            help: "Images must have alt text",
            helpUrl: "https://example.com",
            tags: ["wcag2a"],
            nodes: [
              {
                html: '<img src="test.jpg">',
                target: ["img"],
                failureSummary: "No alt",
              },
            ],
          },
        ],
        htmlContext: '<img src="test.jpg">',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.analyses).toHaveLength(1);
    expect(data.analyses[0].violationId).toBe("image-alt");
    expect(data.analyses[0].fixedHtml).toContain("alt=");
  });

  it("batches violations when > 10", async () => {
    const { generateObject } = await import("ai");
    const { POST } = await import("../app/api/analyze/route");

    const violations = Array.from({ length: 12 }, (_, i) => ({
      id: `violation-${i}`,
      impact: "serious" as const,
      description: `Violation ${i}`,
      help: `Help ${i}`,
      helpUrl: "https://example.com",
      tags: ["wcag2a"],
      nodes: [
        {
          html: `<div id="${i}"></div>`,
          target: [`#${i}`],
          failureSummary: `Failure ${i}`,
        },
      ],
    }));

    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ violations, htmlContext: "<div></div>" }),
    });

    await POST(request);

    // 12 violations / 5 per batch = 3 batches
    expect(generateObject).toHaveBeenCalledTimes(3);
  });
});
