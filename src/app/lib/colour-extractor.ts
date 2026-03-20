import {
  parseColour,
  contrastRatio,
  isLargeText,
  passesAA,
  passesAAA,
  rgbaToHex,
} from "./contrast-utils";
import { ColourPair, ContrastMatrixResult } from "./types";

const MAX_TEXT_NODES = 500;

/**
 * Extract all text/background colour pairs from an iframe document.
 * Walks text nodes, reads computed styles, deduplicates by fg+bg+isLarge.
 */
export function extractColourPairs(doc: Document): ContrastMatrixResult {
  const seen = new Map<string, ColourPair>();
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent?.trim();
      if (!text) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let count = 0;
  let node: Node | null;
  while ((node = walker.nextNode()) && count < MAX_TEXT_NODES) {
    const parent = node.parentElement;
    if (!parent) continue;

    const style = doc.defaultView?.getComputedStyle(parent);
    if (!style) continue;

    const fgStr = style.color;
    const bgStr = resolveBackground(parent, doc);
    if (!bgStr) continue;

    const fg = parseColour(fgStr);
    const bg = parseColour(bgStr);
    if (!fg || !bg) continue;

    // Skip fully transparent foreground
    if (fg.a === 0) continue;

    const fontSize = parseFloat(style.fontSize);
    const fontWeight = parseInt(style.fontWeight, 10) || 400;
    const large = isLargeText(fontSize, fontWeight);

    const fgHex = rgbaToHex(fg);
    const bgHex = rgbaToHex(bg);
    const key = `${fgHex}|${bgHex}|${large}`;

    if (!seen.has(key)) {
      const ratio = contrastRatio(fg, bg);
      seen.set(key, {
        foreground: fgHex,
        background: bgHex,
        contrastRatio: Math.round(ratio * 100) / 100,
        passesAA: passesAA(ratio, large),
        passesAAA: passesAAA(ratio, large),
        isLargeText: large,
        sampleSelector: cssSelector(parent),
        sampleText: (node.textContent || "").trim().slice(0, 60),
      });
    }

    count++;
  }

  const pairs = Array.from(seen.values());
  const uniqueForegrounds = [...new Set(pairs.map((p) => p.foreground))];
  const uniqueBackgrounds = [...new Set(pairs.map((p) => p.background))];

  return { pairs, uniqueForegrounds, uniqueBackgrounds };
}

/**
 * Walk up ancestors to find a non-transparent background colour.
 */
function resolveBackground(el: Element, doc: Document): string | null {
  let current: Element | null = el;
  while (current && current !== doc.documentElement) {
    const style = doc.defaultView?.getComputedStyle(current);
    if (!style) return null;

    const bg = style.backgroundColor;
    const parsed = parseColour(bg);
    // Skip transparent
    if (parsed && parsed.a > 0) return bg;

    current = current.parentElement;
  }
  // Default to white if we reach the root
  return "rgb(255, 255, 255)";
}

/**
 * Build a simple CSS selector for an element (for display purposes).
 */
function cssSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const classes = Array.from(el.classList)
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join("");
  return `${tag}${classes}`;
}
