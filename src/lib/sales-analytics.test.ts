import { describe, it, expect } from "vitest";
import { computeAnalytics, type InputReport } from "./sales-analytics";

// Helper: a report for a given month with a flat list of records.
function report(
  year: number,
  month: number,
  records: InputReport["records"]
): InputReport {
  const totalAmount = records.reduce((s, r) => s + r.amount, 0);
  const totalQty = records.reduce((s, r) => s + r.qty, 0);
  return { periodYear: year, periodMonth: month, totalAmount, totalQty, records };
}

const rec = (flavor: string, size: string, qty: number, amount: number) => ({
  flavor,
  size,
  qty,
  amount,
});

describe("computeAnalytics — empty & single month", () => {
  it("returns an empty analytics for no reports", () => {
    const a = computeAnalytics([]);
    expect(a.monthCount).toBe(0);
    expect(a.months).toEqual([]);
    expect(a.momGrowthPct).toBeNull();
    expect(a.bestMonth).toBeNull();
    expect(a.forecast).toBeNull();
    expect(a.anomalies).toEqual([]);
  });

  it("has no growth or forecast with a single month", () => {
    const a = computeAnalytics([report(2026, 1, [rec("Keju", "350gr", 2, 20000)])]);
    expect(a.monthCount).toBe(1);
    expect(a.momGrowthPct).toBeNull();
    expect(a.forecast).toBeNull();
    expect(a.bestMonth?.amount).toBe(20000);
  });
});

describe("computeAnalytics — ordering & aggregation", () => {
  it("sorts months chronologically regardless of input order", () => {
    const a = computeAnalytics([
      report(2026, 3, [rec("Keju", "350gr", 1, 300)]),
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 200)]),
    ]);
    expect(a.months.map((m) => m.period)).toEqual([
      "2026-01",
      "2026-02",
      "2026-03",
    ]);
  });

  it("sums multiple reports that share the same month", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 1, [rec("Wijen", "250gr", 1, 50)]),
    ]);
    expect(a.monthCount).toBe(1);
    expect(a.months[0].amount).toBe(150);
    expect(a.months[0].qty).toBe(2);
  });

  it("rolls over the year for the forecast's next-month label", () => {
    const a = computeAnalytics([
      report(2025, 11, [rec("Keju", "350gr", 1, 100)]),
      report(2025, 12, [rec("Keju", "350gr", 1, 100)]),
    ]);
    expect(a.forecast?.label).toBe("Januari 2026");
  });
});

describe("computeAnalytics — growth & best month", () => {
  it("computes month-over-month growth from the last two months", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 150)]),
    ]);
    expect(a.momGrowthPct).toBeCloseTo(50); // 100 -> 150
  });

  it("reports negative growth on a decline", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 200)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 150)]),
    ]);
    expect(a.momGrowthPct).toBeCloseTo(-25);
  });

  it("picks the highest-revenue month as best", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 900)]),
      report(2026, 3, [rec("Keju", "350gr", 1, 300)]),
    ]);
    expect(a.bestMonth?.period).toBe("2026-02");
    expect(a.bestMonth?.amount).toBe(900);
  });
});

describe("computeAnalytics — forecast", () => {
  it("extrapolates a perfectly linear upward trend", () => {
    // 100, 200, 300 -> next should be 400 (slope 100).
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 200)]),
      report(2026, 3, [rec("Keju", "350gr", 1, 300)]),
    ]);
    expect(a.forecast?.amount).toBe(400);
  });

  it("never forecasts a negative amount", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 500)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 100)]),
    ]);
    expect(a.forecast!.amount).toBeGreaterThanOrEqual(0);
  });
});

describe("computeAnalytics — anomaly detection", () => {
  it("needs at least 3 months before flagging anomalies", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 100000)]),
    ]);
    expect(a.anomalies).toEqual([]);
  });

  it("flags a clear spike as an upward anomaly on Total", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 3, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 4, [rec("Keju", "350gr", 1, 1000)]),
    ]);
    const total = a.anomalies.find((x) => x.dimension === "Total");
    expect(total).toBeDefined();
    expect(total!.direction).toBe("naik");
    expect(total!.period).toBe("2026-04");
    expect(total!.deviationPct).toBeGreaterThan(0);
  });

  it("does not flag anomalies for stable sales", () => {
    const a = computeAnalytics([
      report(2026, 1, [rec("Keju", "350gr", 1, 100)]),
      report(2026, 2, [rec("Keju", "350gr", 1, 105)]),
      report(2026, 3, [rec("Keju", "350gr", 1, 98)]),
      report(2026, 4, [rec("Keju", "350gr", 1, 102)]),
    ]);
    expect(a.anomalies).toEqual([]);
  });
});
