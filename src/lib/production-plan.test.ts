import { describe, it, expect } from "vitest";
import { computeProductionPlan } from "./production-plan";
import type { InputReport } from "./sales-analytics";

function report(
  year: number,
  month: number,
  records: InputReport["records"]
): InputReport {
  const totalQty = records.reduce((s, r) => s + r.qty, 0);
  const totalAmount = records.reduce((s, r) => s + r.amount, 0);
  return { periodYear: year, periodMonth: month, totalQty, totalAmount, records };
}

const rec = (flavor: string, size: string, qty: number) => ({
  flavor,
  size,
  qty,
  amount: qty * 1000,
});

describe("computeProductionPlan — empty & single month", () => {
  it("returns an empty plan for no reports", () => {
    const p = computeProductionPlan([]);
    expect(p.monthCount).toBe(0);
    expect(p.basis).toBe("none");
    expect(p.nextLabel).toBeNull();
    expect(p.byFlavor).toEqual([]);
    expect(p.totalRecommended).toBe(0);
  });

  it("follows the only month's quantities when there is a single report", () => {
    const p = computeProductionPlan([
      report(2026, 7, [rec("Keju", "350gr", 12), rec("Wijen", "250gr", 8)]),
    ]);
    expect(p.monthCount).toBe(1);
    expect(p.basis).toBe("single-month");
    expect(p.nextLabel).toBe("Agustus 2026");
    const keju = p.byFlavor.find((i) => i.name === "Keju")!;
    expect(keju.recommended).toBe(12);
    expect(keju.lastMonth).toBe(12);
    expect(p.totalRecommended).toBe(20);
  });
});

describe("computeProductionPlan — trend forecast", () => {
  it("extrapolates a rising quantity trend per flavor", () => {
    // Keju qty 10 → 20 → 30 should forecast 40 for next month.
    const p = computeProductionPlan([
      report(2026, 1, [rec("Keju", "350gr", 10)]),
      report(2026, 2, [rec("Keju", "350gr", 20)]),
      report(2026, 3, [rec("Keju", "350gr", 30)]),
    ]);
    expect(p.basis).toBe("trend");
    expect(p.nextLabel).toBe("April 2026");
    const keju = p.byFlavor.find((i) => i.name === "Keju")!;
    expect(keju.recommended).toBe(40);
    expect(keju.lastMonth).toBe(30);
    expect(keju.average).toBe(20);
  });

  it("never recommends a negative quantity on a declining trend", () => {
    const p = computeProductionPlan([
      report(2026, 1, [rec("Wijen", "250gr", 30)]),
      report(2026, 2, [rec("Wijen", "250gr", 10)]),
    ]);
    const wijen = p.byFlavor.find((i) => i.name === "Wijen")!;
    expect(wijen.recommended).toBeGreaterThanOrEqual(0);
  });

  it("treats months with no sale of a flavor as zero in the series", () => {
    // Durian sold only in month 2; month 1 and 3 are implicit zeros.
    const p = computeProductionPlan([
      report(2026, 1, [rec("Keju", "350gr", 10)]),
      report(2026, 2, [rec("Keju", "350gr", 10), rec("Durian", "250gr", 6)]),
      report(2026, 3, [rec("Keju", "350gr", 10)]),
    ]);
    const durian = p.byFlavor.find((i) => i.name === "Durian")!;
    expect(durian.average).toBe(2); // (0 + 6 + 0) / 3 = 2
    expect(durian.lastMonth).toBe(0);
  });
});

describe("computeProductionPlan — aggregation & sorting", () => {
  it("forecasts per size independently of flavor", () => {
    const p = computeProductionPlan([
      report(2026, 1, [rec("Keju", "350gr", 5), rec("Wijen", "350gr", 5)]),
      report(2026, 2, [rec("Keju", "350gr", 10), rec("Wijen", "350gr", 10)]),
    ]);
    const s350 = p.bySize.find((i) => i.name === "350gr")!;
    expect(s350.lastMonth).toBe(20); // 10 + 10
  });

  it("sorts flavors by recommended quantity, highest first", () => {
    const p = computeProductionPlan([
      report(2026, 5, [
        rec("Keju", "350gr", 5),
        rec("Wijen", "250gr", 50),
        rec("Kopi", "250gr", 20),
      ]),
    ]);
    expect(p.byFlavor.map((i) => i.name)).toEqual(["Wijen", "Kopi", "Keju"]);
  });

  it("keeps total recommended equal to the sum of per-flavor recommendations", () => {
    const p = computeProductionPlan([
      report(2026, 6, [rec("Keju", "350gr", 12), rec("Wijen", "250gr", 8)]),
    ]);
    const sum = p.byFlavor.reduce((s, i) => s + i.recommended, 0);
    expect(p.totalRecommended).toBe(sum);
  });
});
