"use client";

import dynamic from "next/dynamic";
import { ViolationAnalysis } from "../lib/types";

const ReactDiffViewer = dynamic(() => import("react-diff-viewer-continued"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 text-sm text-slate-400">
      Loading diff viewer...
    </div>
  ),
});

interface DiffViewerProps {
  analysis: ViolationAnalysis | undefined;
}

export default function DiffViewer({ analysis }: DiffViewerProps) {
  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-slate-400">
        Select a violation to view the diff
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border">
      <ReactDiffViewer
        oldValue={analysis.originalHtml}
        newValue={analysis.fixedHtml}
        splitView={true}
        useDarkTheme={false}
        leftTitle="Original"
        rightTitle="Fixed"
      />
    </div>
  );
}
