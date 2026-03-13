"use client";

import { useState } from "react";

const PLACEHOLDER = `<!-- Paste your HTML here to audit -->
<html>
<head><title>My Page</title></head>
<body>
  <img src="hero.jpg">
  <button onclick="submit()"></button>
  <div style="color: #aaa; background: #fff;">
    Low contrast text
  </div>
</body>
</html>`;

interface HtmlInputProps {
  onAudit: (html: string) => void;
  isLoading: boolean;
}

export default function HtmlInput({ onAudit, isLoading }: HtmlInputProps) {
  const [html, setHtml] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (html.trim()) {
      onAudit(html);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="html-input" className="text-sm font-medium text-slate-700">
        HTML to Audit
      </label>
      <textarea
        id="html-input"
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        placeholder={PLACEHOLDER}
        className="html-input h-64 w-full resize-y rounded-lg border border-border bg-white p-4 text-slate-800 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        spellCheck={false}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Paste any HTML — full page or fragment
        </p>
        <button
          type="submit"
          disabled={isLoading || !html.trim()}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Auditing..." : "Run Audit"}
        </button>
      </div>
    </form>
  );
}
