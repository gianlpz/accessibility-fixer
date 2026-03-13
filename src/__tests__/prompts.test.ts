import { describe, it, expect } from "vitest";
import { buildAnalysisPrompt } from "../app/lib/prompts";
import { AxeViolation } from "../app/lib/types";

describe("buildAnalysisPrompt", () => {
  const mockViolation: AxeViolation = {
    id: "image-alt",
    impact: "critical",
    description: "Ensures <img> elements have alternate text",
    help: "Images must have alternate text",
    helpUrl: "https://dequeuniversity.com/rules/axe/4.10/image-alt",
    tags: ["wcag2a", "wcag111"],
    nodes: [
      {
        html: '<img src="hero.jpg">',
        target: ["img"],
        failureSummary:
          "Fix any of the following: Element does not have an alt attribute",
      },
    ],
  };

  it("includes violation ID and severity", () => {
    const prompt = buildAnalysisPrompt([mockViolation], "<img src='hero.jpg'>");
    expect(prompt).toContain("image-alt");
    expect(prompt).toContain("critical");
  });

  it("includes the HTML context", () => {
    const html = "<div><img src='test.jpg'></div>";
    const prompt = buildAnalysisPrompt([mockViolation], html);
    expect(prompt).toContain(html);
  });

  it("includes WCAG tags", () => {
    const prompt = buildAnalysisPrompt([mockViolation], "");
    expect(prompt).toContain("wcag2a");
    expect(prompt).toContain("wcag111");
  });

  it("includes affected element HTML", () => {
    const prompt = buildAnalysisPrompt([mockViolation], "");
    expect(prompt).toContain('<img src="hero.jpg">');
  });

  it("includes failure summary", () => {
    const prompt = buildAnalysisPrompt([mockViolation], "");
    expect(prompt).toContain("does not have an alt attribute");
  });

  it("handles multiple violations", () => {
    const second: AxeViolation = {
      id: "button-name",
      impact: "serious",
      description: "Ensures buttons have discernible text",
      help: "Buttons must have discernible text",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/button-name",
      tags: ["wcag2a", "wcag412"],
      nodes: [
        {
          html: "<button></button>",
          target: ["button"],
          failureSummary: "Element does not have inner text",
        },
      ],
    };

    const prompt = buildAnalysisPrompt([mockViolation, second], "");
    expect(prompt).toContain("image-alt");
    expect(prompt).toContain("button-name");
    expect(prompt).toContain("Violation 1");
    expect(prompt).toContain("Violation 2");
  });

  it("handles violations with no WCAG tags", () => {
    const noTags: AxeViolation = {
      ...mockViolation,
      tags: ["best-practice"],
    };
    const prompt = buildAnalysisPrompt([noTags], "");
    expect(prompt).toContain("image-alt");
  });
});
