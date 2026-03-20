"use client";

import { useState } from "react";

interface UrlInputProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onScan, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="url-input" className="text-sm font-medium text-slate-700">
        URL to Audit
      </label>
      <input
        id="url-input"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-full rounded-lg border border-border bg-white px-4 py-3 text-slate-800 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Enter a public URL to scan for accessibility issues
        </p>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Scanning..." : "Scan URL"}
        </button>
      </div>
    </form>
  );
}
