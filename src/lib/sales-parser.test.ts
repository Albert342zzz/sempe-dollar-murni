import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { parseSalesWorkbook, aggregate, type ParsedRecord } from "./sales-parser";

// Build an .xlsx in memory from a 2D array and return it as an ArrayBuffer,
// mirroring the owner's wide/matrix layout:
//   row 0 → labels ("Rasa", "Harga Satuan", "Quantity" …)
//   row 1 → size codes, one per column (the detected size-header row)
//   row 2+ → data (one flavor + a qty under one size column)
function workbook(rows: unknown[][]): ArrayBuffer {
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Sheet1");
  const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  // Depending on the build, `out` may be a Uint8Array or a plain number[];
  // normalize to a standalone ArrayBuffer either way.
  return new Uint8Array(out).buffer;
}

const HEADER = [
  ["Rasa", "Harga Satuan", "Quantity", "", ""],
  ["", "", "TK", "DK", "Kaleng"],
];

describe("parseSalesWorkbook", () => {
  it("parses valid sales rows and recalculates amounts from price × qty", () => {
    const buf = workbook([
      ...HEADER,
      ["kj", 10000, 3, 0, 0], // Keju 150gr × 3 = 30000
      ["w", 5000, 0, 2, 0], //  Wijen 350gr × 2 = 10000
    ]);
    const { records, aggregates } = parseSalesWorkbook(buf);

    expect(records).toHaveLength(2);
    expect(aggregates.validRows).toBe(2);
    expect(aggregates.totalQty).toBe(5);
    expect(aggregates.totalAmount).toBe(40000);

    const keju = records.find((r) => r.flavor === "Keju")!;
    expect(keju.size).toBe("150gr");
    expect(keju.amount).toBe(30000);
  });

  it("maps flavor and size codes to human-readable labels", () => {
    const { records } = parseSalesWorkbook(
      workbook([...HEADER, ["kj", 10000, 0, 0, 1]])
    );
    expect(records[0].flavor).toBe("Keju");
    expect(records[0].size).toBe("3kg (kaleng)");
  });

  it("skips a TOTAL row (size quantities but no flavor) and records its row number", () => {
    const buf = workbook([
      ...HEADER,
      ["kj", 10000, 1, 0, 0], // valid (Excel row 3)
      ["", "", 1, 0, 0], //     TOTAL row  (Excel row 4) → skipped
    ]);
    const { records, aggregates, skippedRowNumbers } = parseSalesWorkbook(buf);
    expect(records).toHaveLength(1);
    expect(aggregates.skippedRows).toBe(1);
    expect(skippedRowNumbers).toEqual([4]);
  });

  it("skips a flavor row that has no size quantity (incomplete)", () => {
    const buf = workbook([
      ...HEADER,
      ["kj", 10000, 2, 0, 0], // valid   (Excel row 3)
      ["d", 8000, 0, 0, 0], //   no qty  (Excel row 4) → skipped
    ]);
    const { records, skippedRowNumbers } = parseSalesWorkbook(buf);
    expect(records).toHaveLength(1);
    expect(skippedRowNumbers).toEqual([4]);
  });

  it("emits one record per filled size column on the same row", () => {
    const { records } = parseSalesWorkbook(
      workbook([...HEADER, ["kj", 10000, 1, 2, 0]])
    );
    expect(records).toHaveLength(2);
    expect(records.map((r) => r.size).sort()).toEqual(["150gr", "350gr"]);
  });

  it("throws a helpful error when the layout is unrecognizable", () => {
    const buf = workbook([
      ["Nama", "Alamat", "Telepon"],
      ["Budi", "Temanggung", "0812"],
    ]);
    expect(() => parseSalesWorkbook(buf)).toThrow();
  });
});

describe("aggregate", () => {
  const records: ParsedRecord[] = [
    { flavor: "Keju", size: "350gr", qty: 2, unitPrice: 100, amount: 200 },
    { flavor: "Keju", size: "150gr", qty: 1, unitPrice: 100, amount: 100 },
    { flavor: "Wijen", size: "350gr", qty: 5, unitPrice: 100, amount: 500 },
  ];

  it("totals quantity and amount across all records", () => {
    const a = aggregate(records, 0);
    expect(a.totalQty).toBe(8);
    expect(a.totalAmount).toBe(800);
    expect(a.validRows).toBe(3);
  });

  it("groups by flavor, size and product, sorted by amount desc", () => {
    const a = aggregate(records, 0);
    expect(a.byFlavor.map((b) => b.label)).toEqual(["Wijen", "Keju"]);
    expect(a.byFlavor[0].amount).toBe(500);

    const size350 = a.bySize.find((b) => b.label === "350gr")!;
    expect(size350.amount).toBe(700); // 200 + 500
    expect(size350.qty).toBe(7);

    expect(a.byProduct.map((b) => b.label)).toContain("Keju 350gr");
  });

  it("passes through the skipped-row count", () => {
    expect(aggregate(records, 4).skippedRows).toBe(4);
  });
});
