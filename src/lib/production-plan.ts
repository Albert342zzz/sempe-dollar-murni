import { monthLabel } from "@/lib/months";
import { loadInputReports, type InputReport } from "@/lib/sales-analytics";

// =============================================================================
// PRODUCTION PLAN — deterministic, does NOT use AI.
// Forecasts next month's QUANTITY (pieces) to produce, per flavor and per size,
// from all sales reports. AI only narrates the result (see production-insight).
//
// Method: for each flavor/size we build a monthly quantity series (0 for months
// with no sales) and fit a least-squares line, same as the revenue forecast in
// sales-analytics. With a single month there is no trend, so we fall back to
// that month's actual quantity.
// =============================================================================

export type PlanItem = {
  name: string;
  recommended: number; // forecast qty for next month (pieces)
  lastMonth: number; // qty sold in the most recent month
  average: number; // mean monthly qty (rounded)
};

export type ProductionPlan = {
  monthCount: number;
  nextLabel: string | null; // e.g. "Agustus 2026"
  basis: "trend" | "single-month" | "none";
  byFlavor: PlanItem[];
  bySize: PlanItem[];
  totalRecommended: number; // total pieces for next month
  totalLastMonth: number;
};

const avg = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;

function nextPeriod(year: number, month: number) {
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
}

// Least-squares slope/intercept over the series index (0,1,2,…).
function linreg(y: number[]): { slope: number; intercept: number } {
  const n = y.length;
  const xs = y.map((_, i) => i);
  const mx = avg(xs);
  const my = avg(y);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (y[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: my - slope * mx };
}

// Forecast the next value of a monthly series (never negative; whole pieces).
function forecastQty(series: number[]): number {
  if (series.length === 0) return 0;
  if (series.length === 1) return Math.round(series[0]);
  const { slope, intercept } = linreg(series);
  return Math.max(0, Math.round(slope * series.length + intercept));
}

function buildItems(
  keys: string[],
  seriesByKey: Map<string, number[]>
): PlanItem[] {
  return keys
    .map((name) => {
      const series = seriesByKey.get(name) ?? [];
      return {
        name,
        recommended: forecastQty(series),
        lastMonth: series.length ? series[series.length - 1] : 0,
        average: Math.round(avg(series)),
      };
    })
    .sort((a, b) => b.recommended - a.recommended || b.average - a.average);
}

export function computeProductionPlan(reports: InputReport[]): ProductionPlan {
  // Aggregate quantity per month, per flavor, and per size.
  const monthMap = new Map<
    string,
    {
      year: number;
      month: number;
      byFlavor: Map<string, number>;
      bySize: Map<string, number>;
    }
  >();

  for (const r of reports) {
    const key = `${r.periodYear}-${String(r.periodMonth).padStart(2, "0")}`;
    let m = monthMap.get(key);
    if (!m) {
      m = {
        year: r.periodYear,
        month: r.periodMonth,
        byFlavor: new Map(),
        bySize: new Map(),
      };
      monthMap.set(key, m);
    }
    for (const rec of r.records) {
      m.byFlavor.set(rec.flavor, (m.byFlavor.get(rec.flavor) ?? 0) + rec.qty);
      m.bySize.set(rec.size, (m.bySize.get(rec.size) ?? 0) + rec.qty);
    }
  }

  const monthKeys = [...monthMap.keys()].sort();
  const monthCount = monthKeys.length;

  const empty: ProductionPlan = {
    monthCount,
    nextLabel: null,
    basis: "none",
    byFlavor: [],
    bySize: [],
    totalRecommended: 0,
    totalLastMonth: 0,
  };
  if (monthCount === 0) return empty;

  // Every flavor/size that ever appeared, aligned to the chronological months.
  const flavorNames = new Set<string>();
  const sizeNames = new Set<string>();
  for (const k of monthKeys) {
    const m = monthMap.get(k)!;
    for (const f of m.byFlavor.keys()) flavorNames.add(f);
    for (const s of m.bySize.keys()) sizeNames.add(s);
  }

  const flavorSeries = new Map<string, number[]>();
  const sizeSeries = new Map<string, number[]>();
  for (const name of flavorNames) {
    flavorSeries.set(
      name,
      monthKeys.map((k) => monthMap.get(k)!.byFlavor.get(name) ?? 0)
    );
  }
  for (const name of sizeNames) {
    sizeSeries.set(
      name,
      monthKeys.map((k) => monthMap.get(k)!.bySize.get(name) ?? 0)
    );
  }

  const byFlavor = buildItems([...flavorNames], flavorSeries);
  const bySize = buildItems([...sizeNames], sizeSeries);

  const last = monthMap.get(monthKeys[monthKeys.length - 1])!;
  const np = nextPeriod(last.year, last.month);

  return {
    monthCount,
    nextLabel: monthLabel(np.month, np.year),
    basis: monthCount >= 2 ? "trend" : "single-month",
    byFlavor,
    bySize,
    totalRecommended: byFlavor.reduce((s, i) => s + i.recommended, 0),
    totalLastMonth: byFlavor.reduce((s, i) => s + i.lastMonth, 0),
  };
}

// Load all reports and compute the plan. Used by the page and the AI action.
export async function getProductionPlan(): Promise<ProductionPlan> {
  return computeProductionPlan(await loadInputReports());
}
