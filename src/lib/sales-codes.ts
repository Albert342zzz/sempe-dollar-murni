// =============================================================================
// SALES CODES (from the owner's manual Excel format)
// =============================================================================
// The owner's Excel file uses TWO code columns to identify a product:
//   • "Quantity" column → SIZE code  (e.g. DK = 350gr)
//   • "Rasa" column     → FLAVOR code (e.g. kj = keju)
// One product = flavor + size, e.g. kj + DK = "Keju 350gr".
//
// A row is counted as a BUSINESS sale only if its size code is recognised
// (exists in SIZE_CODES). Uncoded personal/daily rows are discarded.
// =============================================================================

export type CodeDef = { code: string; label: string };

// SIZE codes (from "Quantity" column). Labels match the system's size list.
export const SIZE_CODES: CodeDef[] = [
  { code: "TK", label: "150gr" },
  { code: "KP", label: "230gr" },
  { code: "TB", label: "250gr" },
  { code: "DK", label: "350gr" },
  { code: "1/2", label: "500gr" },
  { code: "DS", label: "700gr" },
  { code: "Dus", label: "3kg (karton)" },
  { code: "Kaleng", label: "3kg (kaleng)" },
];

// FLAVOR codes (from "Rasa" column).
export const FLAVOR_CODES: CodeDef[] = [
  { code: "w", label: "Wijen" },
  { code: "p", label: "Pisang" },
  { code: "b", label: "Brownies" },
  { code: "c", label: "Cokelat" },
  { code: "cap", label: "Cappuccino" },
  { code: "kj", label: "Keju" },
  { code: "coco", label: "Cocopandan" },
  { code: "d", label: "Durian" },
  { code: "k", label: "Kopi" },
  { code: "m", label: "Mocha" },
];

function normalize(raw: unknown): string {
  return String(raw ?? "").trim().toUpperCase();
}

const sizeByCode = new Map(SIZE_CODES.map((c) => [normalize(c.code), c]));
const flavorByCode = new Map(FLAVOR_CODES.map((c) => [normalize(c.code), c]));

export function lookupSize(raw: unknown): CodeDef | undefined {
  const key = normalize(raw);
  return key ? sizeByCode.get(key) : undefined;
}

export function lookupFlavor(raw: unknown): CodeDef | undefined {
  const key = normalize(raw);
  return key ? flavorByCode.get(key) : undefined;
}
