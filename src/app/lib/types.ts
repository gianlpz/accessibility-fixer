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

export interface ViolationAnalysis {
  violationId: string;
  explanation: string;
  fixedHtml: string;
  originalHtml: string;
  wcagCriteria: string[];
}

export interface AnalysisResponse {
  analyses: ViolationAnalysis[];
}

export interface AuditResult {
  violations: AxeViolation[];
  passes: number;
  timestamp: string;
}

// AI provider selection
export type AiProviderName = "gemini" | "spike";

// Input mode for audit page
export type InputMode = "html" | "url";

// URL scanning
export interface UrlScanResult extends AuditResult {
  html: string;
  scannedUrl: string;
  screenshot?: string;
}

// Colour contrast matrix
export interface ColourPair {
  foreground: string;
  background: string;
  contrastRatio: number;
  passesAA: boolean;
  passesAAA: boolean;
  isLargeText: boolean;
  sampleSelector: string;
  sampleText: string;
}

export interface ContrastMatrixResult {
  pairs: ColourPair[];
  uniqueForegrounds: string[];
  uniqueBackgrounds: string[];
}
