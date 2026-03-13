import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SeverityBadge from "../app/components/SeverityBadge";
import TabNav from "../app/components/TabNav";

describe("SeverityBadge", () => {
  it("renders critical badge", () => {
    render(<SeverityBadge severity="critical" />);
    expect(screen.getByText("Critical")).toBeDefined();
  });

  it("renders serious badge", () => {
    render(<SeverityBadge severity="serious" />);
    expect(screen.getByText("Serious")).toBeDefined();
  });

  it("renders moderate badge", () => {
    render(<SeverityBadge severity="moderate" />);
    expect(screen.getByText("Moderate")).toBeDefined();
  });

  it("renders minor badge", () => {
    render(<SeverityBadge severity="minor" />);
    expect(screen.getByText("Minor")).toBeDefined();
  });
});

describe("TabNav", () => {
  const tabs = [
    { id: "violations", label: "Violations" },
    { id: "preview", label: "Preview" },
    { id: "diff", label: "Diff" },
  ];

  it("renders all tabs", () => {
    render(
      <TabNav activeTab="violations" onTabChange={() => {}} tabs={tabs} />
    );
    expect(screen.getByText("Violations")).toBeDefined();
    expect(screen.getByText("Preview")).toBeDefined();
    expect(screen.getByText("Diff")).toBeDefined();
  });

  it("marks active tab with aria-selected", () => {
    render(
      <TabNav activeTab="preview" onTabChange={() => {}} tabs={tabs} />
    );
    const previewTab = screen.getByText("Preview");
    expect(previewTab.getAttribute("aria-selected")).toBe("true");
  });

  it("has tablist role", () => {
    render(
      <TabNav activeTab="violations" onTabChange={() => {}} tabs={tabs} />
    );
    expect(screen.getByRole("tablist")).toBeDefined();
  });
});
