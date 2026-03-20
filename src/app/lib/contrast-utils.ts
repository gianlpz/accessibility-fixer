// WCAG 2.x colour contrast utilities — all pure functions, no DOM dependency

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

const NAMED_COLOURS: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  orange: "#ffa500",
  purple: "#800080",
  gray: "#808080",
  grey: "#808080",
  silver: "#c0c0c0",
  maroon: "#800000",
  navy: "#000080",
  teal: "#008080",
  olive: "#808000",
  lime: "#00ff00",
  aqua: "#00ffff",
  fuchsia: "#ff00ff",
  transparent: "#00000000",
};

/**
 * Parse a CSS colour string into RGBA components (0–255 for r/g/b, 0–1 for a).
 * Supports: hex (3/4/6/8 digits), rgb(), rgba(), named colours.
 */
export function parseColour(css: string): RGBA | null {
  const s = css.trim().toLowerCase();

  // Named colour
  if (NAMED_COLOURS[s]) {
    return parseColour(NAMED_COLOURS[s]);
  }

  // Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    // Validate hex characters
    if (!/^[0-9a-f]+$/.test(hex)) return null;
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 4) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16) / 255,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    }
    return null;
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = s.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  return null;
}

/**
 * Linearize a single sRGB channel (0–255) for luminance calculation.
 */
function linearize(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * WCAG relative luminance: 0.2126R + 0.7152G + 0.0722B
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG contrast ratio between two colours. Returns value between 1 and 21.
 */
export function contrastRatio(fg: RGBA, bg: RGBA): number {
  const l1 = relativeLuminance(fg.r, fg.g, fg.b);
  const l2 = relativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG "large text" threshold: >= 24px, or >= 18.66px and bold (weight >= 700).
 */
export function isLargeText(fontSize: number, fontWeight: number): boolean {
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
}

/**
 * Checks AA compliance. Normal text: 4.5:1, large text: 3:1.
 */
export function passesAA(ratio: number, large: boolean): boolean {
  return large ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Checks AAA compliance. Normal text: 7:1, large text: 4.5:1.
 */
export function passesAAA(ratio: number, large: boolean): boolean {
  return large ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Convert RGBA to hex string (6-digit, no alpha).
 */
export function rgbaToHex(c: RGBA): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
}

/**
 * Convert RGB to HSL. Returns [h (0–360), s (0–1), l (0–1)].
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return [h * 360, s, l];
}

/**
 * Convert HSL to RGB.
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hN = h / 360;
  return [
    Math.round(hue2rgb(p, q, hN + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hN) * 255),
    Math.round(hue2rgb(p, q, hN - 1 / 3) * 255),
  ];
}

/**
 * Suggest an accessible foreground colour by binary-searching HSL lightness.
 * Keeps hue and saturation, adjusts lightness to meet targetRatio against bg.
 */
export function suggestAccessibleColour(
  fg: RGBA,
  bg: RGBA,
  targetRatio: number
): string {
  const [h, s] = rgbToHsl(fg.r, fg.g, fg.b);
  const bgLum = relativeLuminance(bg.r, bg.g, bg.b);

  // Determine if we need a darker or lighter fg
  const fgLum = relativeLuminance(fg.r, fg.g, fg.b);
  const goDarker = fgLum <= bgLum;

  // Search the full lightness range in the appropriate direction
  let lo = 0;
  let hi = 1;

  // Binary search for the lightness that meets the target ratio,
  // staying closest to the original hue
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const [r, g, b] = hslToRgb(h, s, mid);
    const lum = relativeLuminance(r, g, b);
    const lighter = Math.max(lum, bgLum);
    const darker = Math.min(lum, bgLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    if (ratio >= targetRatio) {
      // We have enough contrast — move towards bg luminance (less extreme)
      if (goDarker) lo = mid;
      else hi = mid;
    } else {
      // Not enough contrast — move away from bg luminance (more extreme)
      if (goDarker) hi = mid;
      else lo = mid;
    }
  }

  // Pick the side that guarantees meeting the target
  const finalL = goDarker ? lo : hi;
  const [r, g, b] = hslToRgb(h, s, finalL);
  return rgbaToHex({ r, g, b, a: 1 });
}
