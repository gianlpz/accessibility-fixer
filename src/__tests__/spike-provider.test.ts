import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Must be set before importing SpikeProvider
vi.stubEnv("SPIKE_LAND_API_KEY", "sk-test-key");

import { SpikeProvider } from "../app/lib/spike-provider";

describe("SpikeProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws if SPIKE_LAND_API_KEY is not set", async () => {
    const original = process.env.SPIKE_LAND_API_KEY;
    delete process.env.SPIKE_LAND_API_KEY;
    expect(() => new SpikeProvider()).toThrow("SPIKE_LAND_API_KEY is not set");
    process.env.SPIKE_LAND_API_KEY = original;
  });

  it("sends correct auth header and PRD filter in request body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: JSON.stringify({
          analyses: [
            {
              violationId: "image-alt",
              explanation: "Images need alt text.",
              fixedHtml: '<img src="test.jpg" alt="Photo">',
              originalHtml: '<img src="test.jpg">',
              wcagCriteria: ["1.1.1"],
            },
          ],
        }),
      }),
    });

    const provider = new SpikeProvider();
    await provider.analyzeViolations(
      [
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
      "<html><body><img src='test.jpg'></body></html>"
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.spike.land/v1/ask");
    expect(options.headers.Authorization).toBe("Bearer sk-test-key");

    const body = JSON.parse(options.body);
    expect(body.model).toBe("smart");
    expect(body.prd_filter).toBeDefined();
    expect(body.prd_filter.name).toBe("WCAG Access4U");
    expect(body.prd_filter.constraints).toHaveLength(6);
  });

  it("parses JSON response correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: JSON.stringify({
          analyses: [
            {
              violationId: "color-contrast",
              explanation: "Text needs sufficient contrast.",
              fixedHtml: '<p style="color: #000">Text</p>',
              originalHtml: '<p style="color: #ccc">Text</p>',
              wcagCriteria: ["1.4.3"],
            },
          ],
        }),
      }),
    });

    const provider = new SpikeProvider();
    const result = await provider.analyzeViolations(
      [
        {
          id: "color-contrast",
          impact: "serious",
          description: "Low contrast",
          help: "Fix contrast",
          helpUrl: "https://example.com",
          tags: ["wcag2aa"],
          nodes: [
            {
              html: '<p style="color: #ccc">Text</p>',
              target: ["p"],
              failureSummary: "Low contrast ratio",
            },
          ],
        },
      ],
      "<html></html>"
    );

    expect(result).toHaveLength(1);
    expect(result[0].violationId).toBe("color-contrast");
    expect(result[0].wcagCriteria).toContain("1.4.3");
  });

  it("handles markdown-wrapped JSON responses", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response:
          '```json\n{"analyses": [{"violationId": "label", "explanation": "Form inputs need labels.", "fixedHtml": "<label for=\\"name\\">Name</label><input id=\\"name\\">", "originalHtml": "<input>", "wcagCriteria": ["1.3.1"]}]}\n```',
      }),
    });

    const provider = new SpikeProvider();
    const result = await provider.analyzeViolations(
      [
        {
          id: "label",
          impact: "critical",
          description: "Form elements need labels",
          help: "Add labels",
          helpUrl: "https://example.com",
          tags: ["wcag2a"],
          nodes: [
            { html: "<input>", target: ["input"], failureSummary: "No label" },
          ],
        },
      ],
      "<html></html>"
    );

    expect(result).toHaveLength(1);
    expect(result[0].violationId).toBe("label");
  });

  it("throws on API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    const provider = new SpikeProvider();
    await expect(
      provider.analyzeViolations(
        [
          {
            id: "test",
            impact: "minor",
            description: "Test",
            help: "Test",
            helpUrl: "",
            tags: [],
            nodes: [
              { html: "<div></div>", target: ["div"], failureSummary: "Fail" },
            ],
          },
        ],
        "<html></html>"
      )
    ).rejects.toThrow("spike.land API error (401)");
  });
});
