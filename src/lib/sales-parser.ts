import * as XLSX from "xlsx";
import { lookupSize, lookupFlavor } from "@/lib/sales-codes";

// =============================================================================
// SALES EXCEL PARSER (deterministic — does NOT use AI for calculations)
// =============================================================================
// File format (wide/matrix layout):
//   • "Rasa" column         → flavor code (w, p, kj, ...)
//   • "Harga Satuan" column → unit price
//   • "Quantity" header spans MANY columns, each column = one size
//     (Kaleng, Dus, 1/2, KP, DK, DS, TB, TK). Cell value =
//     number of units sold for that size on that row.
//   • "Jumlah"/"Total" columns are ignored (we recalculate from price × qty
//     to avoid double-counting; "Total" is only a per-receipt total).
//
// Each data row = one flavor + one size (whichever size column is filled).
// =============================================================================

const FLAVOR_RE = /\b(rasa|flavou?r)\b/i;
const PRICE_RE = /(harga|satuan|hrg|price)/i;

export type ParsedRecord = {
  flavor: string;
  size: string;
  qty: number;
  unitPrice: number;
  amount: number;
};

export type Breakdown = {
  label: string;
  qty: number;
  amount: number;
};

export type SalesAggregates = {
  totalAmount: number;
  totalQty: number;
  validRows: number;
  skippedRows: number;
  byProduct: Breakdown[]; // "Keju 350gr"
  byFlavor: Breakdown[]; // "Keju"
  bySize: Breakdown[]; // "350gr"
};

export type ParseResult = {
  records: ParsedRecord[];
  aggregates: SalesAggregates;
  skippedRowNumbers: number[]; // Excel row numbers that were skipped
};

// Parse a cell value to number; handles Indonesian number format ("15.000", "Rp 15.000").
function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (value == null) return 0;
  const digits = String(value).replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// Convert a cell to text. Excel often coerces the "1/2" header into a date
// (e.g. Feb 1); turn it back into "d/m" (or "m/d") so it matches a size code.
function cellText(value: unknown): string {
  if (value instanceof Date && !isNaN(value.getTime())) {
    const dm = `${value.getDate()}/${value.getMonth() + 1}`;
    const md = `${value.getMonth() + 1}/${value.getDate()}`;
    if (lookupSize(dm)) return dm;
    if (lookupSize(md)) return md;
    return dm;
  }
  return String(value ?? "").trim();
}

type Layout = {
  sizeHeaderRow: number;
  flavorCol: number;
  priceCol: number;
  sizeCols: { col: number; label: string }[];
};

// Detect layout: size header row = row with the most cells matching a known size code.
// Flavor and price columns are searched in that row and the row above it.
function detectLayout(rows: unknown[][]): Layout | null {
  const scan = Math.min(rows.length, 20);

  let sizeHeaderRow = -1;
  let bestCount = 0;
  for (let r = 0; r < scan; r++) {
    const row = rows[r] ?? [];
    let count = 0;
    for (const cell of row) if (lookupSize(cellText(cell))) count++;
    if (count > bestCount) {
      bestCount = count;
      sizeHeaderRow = r;
    }
  }
  if (sizeHeaderRow === -1 || bestCount < 2) return null;

  const sizeCols: { col: number; label: string }[] = [];
  (rows[sizeHeaderRow] ?? []).forEach((cell, c) => {
    const text = cellText(cell);
    if (text !== "") {
      sizeCols.push({ col: c, label: lookupSize(text)?.label ?? text });
    }
  });

  let flavorCol = -1;
  let priceCol = -1;
  for (const r of [sizeHeaderRow - 1, sizeHeaderRow]) {
    if (r < 0) continue;
    (rows[r] ?? []).forEach((cell, c) => {
      const t = String(cell ?? "");
      if (flavorCol === -1 && FLAVOR_RE.test(t)) flavorCol = c;
      if (priceCol === -1 && PRICE_RE.test(t)) priceCol = c;
    });
  }

  if (flavorCol === -1 || sizeCols.length === 0) return null;
  return { sizeHeaderRow, flavorCol, priceCol, sizeCols };
}

export function parseSalesWorkbook(buffer: ArrayBuffer): ParseResult {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  // blankrows:true keeps array index aligned with the Excel row number (index + 1).
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: true,
    blankrows: true,
  });

  const layout = detectLayout(rows);
  if (!layout) {
    throw new Error(
      "Tidak bisa mengenali tata letak. Pastikan ada kolom 'Rasa' dan header ukuran (Kaleng, Dus, 1/2, KP, DK, DS, TB, TK)."
    );
  }

  const { sizeHeaderRow, flavorCol, priceCol, sizeCols } = layout;
  const records: ParsedRecord[] = [];
  const skippedRowNumbers: number[] = [];

  for (let r = sizeHeaderRow + 1; r < rows.length; r++) {
    const row = rows[r] ?? [];
    if (row.every((c) => c == null || String(c).trim() === "")) continue;

    const excelRow = r + 1; // array index = Excel row number - 1

    // A sales row MUST have a flavor. Rows without one (e.g. TOTAL/summary rows
    // that only sum the size columns) are skipped — per-size totals are already
    // computed separately in bySize.
    const flavorText = cellText(row[flavorCol]);
    if (flavorText === "") {
      const hasQty = sizeCols.some(({ col }) => toNumber(row[col]) > 0);
      if (hasQty) skippedRowNumbers.push(excelRow);
      continue;
    }

    const flavor = lookupFlavor(flavorText)?.label ?? flavorText;
    const unitPrice = priceCol !== -1 ? toNumber(row[priceCol]) : 0;

    let emitted = 0;
    for (const { col, label } of sizeCols) {
      const qty = toNumber(row[col]);
      if (qty > 0) {
        records.push({
          flavor,
          size: label,
          qty,
          unitPrice,
          amount: qty * unitPrice,
        });
        emitted++;
      }
    }

    // Flavor present but no size qty — incomplete row.
    if (emitted === 0) skippedRowNumbers.push(excelRow);
  }

  return {
    records,
    skippedRowNumbers,
    aggregates: aggregate(records, skippedRowNumbers.length),
  };
}

function addTo(map: Map<string, Breakdown>, label: string, qty: number, amount: number) {
  const b = map.get(label) ?? { label, qty: 0, amount: 0 };
  b.qty += qty;
  b.amount += amount;
  map.set(label, b);
}

const sortByAmount = (a: Breakdown, b: Breakdown) => b.amount - a.amount;

// Exported separately so it can be reused (e.g. regenerate insight from stored records).
export function aggregate(
  records: ParsedRecord[],
  skippedRows: number
): SalesAggregates {
  let totalAmount = 0;
  let totalQty = 0;

  const productMap = new Map<string, Breakdown>();
  const flavorMap = new Map<string, Breakdown>();
  const sizeMap = new Map<string, Breakdown>();

  for (const rec of records) {
    totalAmount += rec.amount;
    totalQty += rec.qty;

    const product = rec.flavor ? `${rec.flavor} ${rec.size}` : rec.size;
    addTo(productMap, product, rec.qty, rec.amount);
    if (rec.flavor) addTo(flavorMap, rec.flavor, rec.qty, rec.amount);
    addTo(sizeMap, rec.size, rec.qty, rec.amount);
  }

  return {
    totalAmount,
    totalQty,
    validRows: records.length,
    skippedRows,
    byProduct: [...productMap.values()].sort(sortByAmount),
    byFlavor: [...flavorMap.values()].sort(sortByAmount),
    bySize: [...sizeMap.values()].sort(sortByAmount),
  };
}
