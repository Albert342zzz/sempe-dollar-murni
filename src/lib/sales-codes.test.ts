import { describe, it, expect } from "vitest";
import { lookupSize, lookupFlavor } from "./sales-codes";

describe("lookupSize", () => {
  it("maps a known size code to its label", () => {
    expect(lookupSize("DK")?.label).toBe("350gr");
    expect(lookupSize("Kaleng")?.label).toBe("3kg (kaleng)");
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(lookupSize("  dk  ")?.label).toBe("350gr");
    expect(lookupSize("kaleng")?.code).toBe("Kaleng");
  });

  it("handles the '1/2' code", () => {
    expect(lookupSize("1/2")?.label).toBe("500gr");
  });

  it("returns undefined for unknown or empty input", () => {
    expect(lookupSize("ZZ")).toBeUndefined();
    expect(lookupSize("")).toBeUndefined();
    expect(lookupSize(null)).toBeUndefined();
    expect(lookupSize(undefined)).toBeUndefined();
  });
});

describe("lookupFlavor", () => {
  it("maps known flavor codes to labels", () => {
    expect(lookupFlavor("kj")?.label).toBe("Keju");
    expect(lookupFlavor("w")?.label).toBe("Wijen");
    expect(lookupFlavor("coco")?.label).toBe("Cocopandan");
  });

  it("is case-insensitive", () => {
    expect(lookupFlavor("KJ")?.label).toBe("Keju");
  });

  it("returns undefined for unknown codes", () => {
    expect(lookupFlavor("xyz")).toBeUndefined();
    expect(lookupFlavor("")).toBeUndefined();
  });
});
