export type SeverityLevel = "critical" | "serious" | "moderate" | "minor";

export interface AxeViolation {
  id: string;
  impact: SeverityLevel;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: AxeViolationNode[];
}

export interface AxeViolationNode {
  html: string;
  target: string[];
  failureSummary: string;
}

export interface AuditResult {
  violations: AxeViolation[];
  passes: number;
  timestamp: string;
  pageUrl: string;
  pageTitle: string;
  screenshot?: string;
  html?: string;
}
