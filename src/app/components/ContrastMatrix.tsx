"use client";

import { useState } from "react";
import { ColourPair, ContrastMatrixResult } from "../lib/types";
import { suggestAccessibleColour, parseColour } from "../lib/contrast-utils";

interface ContrastMatrixProps {
  result: ContrastMatrixResult;
}

export default function ContrastMatrix({ result }: ContrastMatrixProps) {
  const [selectedPair, setSelectedPair] = useState<ColourPair | null>(null);
  const [showFailingOnly, setShowFailingOnly] = useState(false);

  const pairs = showFailingOnly
    ? result.pairs.filter((p) => !p.passesAA)
    : result.pairs;

  const foregrounds = showFailingOnly
    ? [...new Set(pairs.map((p) => p.foreground))]
    : result.uniqueForegrounds;
  const backgrounds = showFailingOnly
    ? [...new Set(pairs.map((p) => p.background))]
    : result.uniqueBackgrounds;

  function getPair(fg: string, bg: string): ColourPair | undefined {
    return pairs.find((p) => p.foreground === fg && p.background === bg);
  }

  function ratingColour(pair: ColourPair): string {
    if (pair.passesAAA) return "bg-green-100 text-green-800 border-green-200";
    if (pair.passesAA) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  }

  function ratingLabel(pair: ColourPair): string {
    if (pair.passesAAA) return "AAA";
    if (pair.passesAA) return "AA";
    return "Fail";
  }

  const failCount = result.pairs.filter((p) => !p.passesAA).length;
  const totalCount = result.pairs.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            {totalCount} colour pair{totalCount !== 1 ? "s" : ""} found
          </span>
          {failCount > 0 && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              {failCount} failing
            </span>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={showFailingOnly}
            onChange={(e) => setShowFailingOnly(e.target.checked)}
            className="rounded"
          />
          Show only failing pairs
        </label>
      </div>

      {pairs.length === 0 && (
        <p className="text-sm text-slate-400">
          {showFailingOnly
            ? "All colour pairs pass WCAG AA — nice!"
            : "No colour pairs detected."}
        </p>
      )}

      {/* Matrix Grid */}
      {foregrounds.length > 0 && backgrounds.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50">
                <th className="border-b border-r border-border px-3 py-2 text-left text-slate-500 font-medium">
                  FG \ BG
                </th>
                {backgrounds.map((bg) => (
                  <th
                    key={bg}
                    className="border-b border-r border-border px-3 py-2"
                  >
                    <div className="flex items-center gap-1.5 justify-center">
                      <span
                        className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                        style={{ backgroundColor: bg }}
                      />
                      <span className="font-mono text-slate-600">{bg}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {foregrounds.map((fg) => (
                <tr key={fg}>
                  <td className="border-b border-r border-border px-3 py-2 bg-slate-50">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                        style={{ backgroundColor: fg }}
                      />
                      <span className="font-mono text-slate-600">{fg}</span>
                    </div>
                  </td>
                  {backgrounds.map((bg) => {
                    const pair = getPair(fg, bg);
                    if (!pair) {
                      return (
                        <td
                          key={bg}
                          className="border-b border-r border-border px-3 py-2 text-center text-slate-300"
                        >
                          —
                        </td>
                      );
                    }
                    return (
                      <td
                        key={bg}
                        className="border-b border-r border-border px-1 py-1"
                      >
                        <button
                          onClick={() => setSelectedPair(pair)}
                          className={`w-full rounded border px-2 py-1.5 text-center font-medium transition-colors hover:opacity-80 ${ratingColour(pair)}`}
                        >
                          <span className="block text-[11px]">
                            {pair.contrastRatio.toFixed(2)}:1
                          </span>
                          <span className="block text-[9px] opacity-70">
                            {ratingLabel(pair)}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Panel */}
      {selectedPair && (
        <DetailPanel
          pair={selectedPair}
          onClose={() => setSelectedPair(null)}
        />
      )}
    </div>
  );
}

function DetailPanel({
  pair,
  onClose,
}: {
  pair: ColourPair;
  onClose: () => void;
}) {
  const fg = parseColour(pair.foreground);
  const bg = parseColour(pair.background);
  const suggestedAA =
    fg && bg && !pair.passesAA
      ? suggestAccessibleColour(fg, bg, pair.isLargeText ? 3 : 4.5)
      : null;
  const suggestedAAA =
    fg && bg && !pair.passesAAA
      ? suggestAccessibleColour(fg, bg, pair.isLargeText ? 4.5 : 7)
      : null;

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          Colour Pair Detail
        </h3>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
          aria-label="Close detail panel"
        >
          Close
        </button>
      </div>

      {/* Preview */}
      <div
        className="mt-3 rounded border border-border p-4"
        style={{ backgroundColor: pair.background }}
      >
        <p
          className="text-lg font-medium"
          style={{ color: pair.foreground }}
        >
          Sample text preview
        </p>
        <p className="text-sm" style={{ color: pair.foreground }}>
          {pair.sampleText || "The quick brown fox jumps over the lazy dog."}
        </p>
      </div>

      {/* Details */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-400">Foreground</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="inline-block h-4 w-4 rounded border border-slate-300"
              style={{ backgroundColor: pair.foreground }}
            />
            <code className="text-slate-700">{pair.foreground}</code>
          </div>
        </div>
        <div>
          <span className="text-slate-400">Background</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="inline-block h-4 w-4 rounded border border-slate-300"
              style={{ backgroundColor: pair.background }}
            />
            <code className="text-slate-700">{pair.background}</code>
          </div>
        </div>
        <div>
          <span className="text-slate-400">Contrast Ratio</span>
          <p className="mt-1 font-medium text-slate-700">
            {pair.contrastRatio.toFixed(2)}:1
          </p>
        </div>
        <div>
          <span className="text-slate-400">Text Size</span>
          <p className="mt-1 text-slate-700">
            {pair.isLargeText ? "Large" : "Normal"}
          </p>
        </div>
        <div>
          <span className="text-slate-400">Selector</span>
          <code className="mt-1 block text-slate-700">
            {pair.sampleSelector}
          </code>
        </div>
      </div>

      {/* WCAG Status */}
      <div className="mt-3 flex gap-2">
        <StatusBadge
          label="AA (normal)"
          pass={pair.isLargeText || pair.passesAA}
        />
        <StatusBadge
          label="AA (large)"
          pass={pair.contrastRatio >= 3}
        />
        <StatusBadge
          label="AAA (normal)"
          pass={pair.isLargeText || pair.passesAAA}
        />
        <StatusBadge
          label="AAA (large)"
          pass={pair.contrastRatio >= 4.5}
        />
      </div>

      {/* Suggestions */}
      {suggestedAA && (
        <div className="mt-3 rounded border border-green-200 bg-green-50 p-2 text-xs">
          <span className="font-medium text-green-800">Suggested fix (AA):</span>{" "}
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded border border-green-300"
              style={{ backgroundColor: suggestedAA }}
            />
            <code className="text-green-700">{suggestedAA}</code>
          </span>
        </div>
      )}
      {suggestedAAA && (
        <div className="mt-2 rounded border border-green-200 bg-green-50 p-2 text-xs">
          <span className="font-medium text-green-800">Suggested fix (AAA):</span>{" "}
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded border border-green-300"
              style={{ backgroundColor: suggestedAAA }}
            />
            <code className="text-green-700">{suggestedAAA}</code>
          </span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
        pass
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {label}: {pass ? "Pass" : "Fail"}
    </span>
  );
}
