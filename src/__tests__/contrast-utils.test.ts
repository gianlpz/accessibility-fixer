import { describe, it, expect } from "vitest";
import {
  parseColour,
  relativeLuminance,
  contrastRatio,
  isLargeText,
  passesAA,
  passesAAA,
  rgbaToHex,
  suggestAccessibleColour,
} from "../app/lib/contrast-utils";

describe("parseColour", () => {
  it("parses 6-digit hex", () => {
    expect(parseColour("#ff0000")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("parses 3-digit hex", () => {
    expect(parseColour("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("parses 8-digit hex with alpha", () => {
    const result = parseColour("#ff000080");
    expect(result?.r).toBe(255);
    expect(result?.g).toBe(0);
    expect(result?.b).toBe(0);
    expect(result?.a).toBeCloseTo(0.502, 1);
  });

  it("parses 4-digit hex with alpha", () => {
    const result = parseColour("#f008");
    expect(result?.r).toBe(255);
    expect(result?.a).toBeCloseTo(0.533, 1);
  });

  it("parses rgb()", () => {
    expect(parseColour("rgb(128, 64, 32)")).toEqual({
      r: 128,
      g: 64,
      b: 32,
      a: 1,
    });
  });

  it("parses rgba()", () => {
    expect(parseColour("rgba(128, 64, 32, 0.5)")).toEqual({
      r: 128,
      g: 64,
      b: 32,
      a: 0.5,
    });
  });

  it("parses named colours", () => {
    expect(parseColour("white")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColour("black")).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it("handles case-insensitive input", () => {
    expect(parseColour("#FF0000")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("returns null for invalid input", () => {
    expect(parseColour("notacolour")).toBeNull();
    expect(parseColour("#gg0000")).toBeNull();
  });
});

describe("relativeLuminance", () => {
  it("returns 0 for black", () => {
    expect(relativeLuminance(0, 0, 0)).toBe(0);
  });

  it("returns 1 for white", () => {
    expect(relativeLuminance(255, 255, 255)).toBe(1);
  });

  it("returns intermediate value for grey", () => {
    const lum = relativeLuminance(128, 128, 128);
    expect(lum).toBeGreaterThan(0.2);
    expect(lum).toBeLessThan(0.3);
  });
});

describe("contrastRatio", () => {
  it("returns 21:1 for black on white", () => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    expect(contrastRatio(black, white)).toBe(21);
  });

  it("returns 1:1 for same colour", () => {
    const red = { r: 255, g: 0, b: 0, a: 1 };
    expect(contrastRatio(red, red)).toBe(1);
  });

  it("is symmetric", () => {
    const fg = { r: 100, g: 50, b: 200, a: 1 };
    const bg = { r: 255, g: 255, b: 200, a: 1 };
    expect(contrastRatio(fg, bg)).toBe(contrastRatio(bg, fg));
  });

  it("returns known ratio for #777 on white", () => {
    const grey = { r: 119, g: 119, b: 119, a: 1 };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    const ratio = contrastRatio(grey, white);
    // Known: approximately 4.48:1
    expect(ratio).toBeGreaterThan(4.4);
    expect(ratio).toBeLessThan(4.6);
  });
});

describe("isLargeText", () => {
  it("returns true for 24px+ text", () => {
    expect(isLargeText(24, 400)).toBe(true);
    expect(isLargeText(30, 400)).toBe(true);
  });

  it("returns true for 18.66px+ bold text", () => {
    expect(isLargeText(18.66, 700)).toBe(true);
    expect(isLargeText(19, 800)).toBe(true);
  });

  it("returns false for small normal text", () => {
    expect(isLargeText(16, 400)).toBe(false);
    expect(isLargeText(18, 600)).toBe(false);
  });
});

describe("passesAA / passesAAA", () => {
  it("AA: 4.5:1 for normal, 3:1 for large", () => {
    expect(passesAA(4.5, false)).toBe(true);
    expect(passesAA(4.49, false)).toBe(false);
    expect(passesAA(3, true)).toBe(true);
    expect(passesAA(2.99, true)).toBe(false);
  });

  it("AAA: 7:1 for normal, 4.5:1 for large", () => {
    expect(passesAAA(7, false)).toBe(true);
    expect(passesAAA(6.99, false)).toBe(false);
    expect(passesAAA(4.5, true)).toBe(true);
    expect(passesAAA(4.49, true)).toBe(false);
  });
});

describe("rgbaToHex", () => {
  it("converts to lowercase hex", () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 1 })).toBe("#ff0000");
    expect(rgbaToHex({ r: 0, g: 128, b: 255, a: 1 })).toBe("#0080ff");
  });

  it("clamps out-of-range values", () => {
    expect(rgbaToHex({ r: 300, g: -10, b: 128, a: 1 })).toBe("#ff0080");
  });
});

describe("suggestAccessibleColour", () => {
  it("suggests a colour that meets target ratio", () => {
    const fg = { r: 170, g: 170, b: 170, a: 1 }; // #aaaaaa (fails on white)
    const bg = { r: 255, g: 255, b: 255, a: 1 };
    const suggested = suggestAccessibleColour(fg, bg, 4.5);

    // Parse the suggestion and verify it meets ratio
    const suggestedParsed = parseColour(suggested);
    expect(suggestedParsed).not.toBeNull();
    if (suggestedParsed) {
      const ratio = contrastRatio(suggestedParsed, bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("returns a valid hex colour", () => {
    const fg = { r: 200, g: 200, b: 200, a: 1 };
    const bg = { r: 255, g: 255, b: 255, a: 1 };
    const suggested = suggestAccessibleColour(fg, bg, 7);
    expect(suggested).toMatch(/^#[0-9a-f]{6}$/);
  });
});
