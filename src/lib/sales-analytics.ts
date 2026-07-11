import { prisma } from "@/lib/prisma";
import { monthLabel } from "@/lib/months";

// =============================================================================
// CROSS-REPORT ANALYTICS — deterministic, does NOT use AI.
// Computes monthly trend, growth, anomalies (z-score), and a simple forecast
// from all sales reports. AI only narrates the result.
// =============================================================================

export type InputReport = {
  periodYear: number;
  periodMonth: number;
  totalAmount: number;
  totalQty: number;
  records: { flavor: string; size: string; qty: number; amount: number }[];
};

export type MonthPoint = {
  period: string; // "YYYY-MM"
  label: string; // "Maret 2026"
  amount: number;
  qty: number;
};

export type Anomaly = {
  period: string;
  label: string; // month label
  dimension: "Total" | "Rasa" | "Ukuran";
  name: string; // "Total" | flavor name | size name
  value: number;
  mean: number;
  deviationPct: number; // + up / - down
  direction: "naik" | "turun";
};

export type Forecast = { label: string; amount: number } | null;

export type Analytics = {
  months: MonthPoint[];
  momGrowthPct: number | null; // last month vs previous
  bestMonth: MonthPoint | null;
  anomalies: Anomaly[];
  forecast: Forecast;
  monthCount: number;
};

const avg = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;

function nextPeriod(year: number, month: number): { year: number; month: number } {
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

// Linear regression (least squares) for the forecast.
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

// Find anomalies in one series (values per month). Flagged when the deviation
// from the mean is >= 30% AND z-score >= 1 (needs >= 3 months to be meaningful).
function detectAnomalies(
  months: MonthPoint[],
  values: number[],
  dimension: Anomaly["dimension"],
  name: string
): Anomaly[] {
  if (months.length < 3) return [];
  const mean = avg(values);
  if (mean <= 0) return [];
  const std = Math.sqrt(avg(values.map((v) => (v - mean) ** 2)));
  const out: Anomaly[] = [];
  for (let i = 0; i < months.length; i++) {
    const v = values[i];
    if (v <= 0) continue;
    const devPct = ((v - mean) / mean) * 100;
    const z = std > 0 ? Math.abs(v - mean) / std : 0;
    if (Math.abs(devPct) >= 30 && z >= 1) {
      out.push({
        period: months[i].period,
        label: months[i].label,
        dimension,
        name,
        value: v,
        mean,
        deviationPct: devPct,
        direction: devPct >= 0 ? "naik" : "turun",
      });
    }
  }
  return out;
}

export function computeAnalytics(reports: InputReport[]): Analytics {
  // Aggregate per month (sum when several reports share the same month).
  const map = new Map<
    string,
    {
      year: number;
      month: number;
      amount: number;
      qty: number;
      byFlavor: Map<string, number>;
      bySize: Map<string, number>;
    }
  >();
  for (const r of reports) {
    const key = `${r.periodYear}-${String(r.periodMonth).padStart(2, "0")}`;
    let m = map.get(key);
    if (!m) {
      m = {
        year: r.periodYear,
        month: r.periodMonth,
        amount: 0,
        qty: 0,
        byFlavor: new Map(),
        bySize: new Map(),
      };
      map.set(key, m);
    }
    m.amount += r.totalAmount;
    m.qty += r.totalQty;
    for (const rec of r.records) {
      m.byFlavor.set(rec.flavor, (m.byFlavor.get(rec.flavor) ?? 0) + rec.amount);
      m.bySize.set(rec.size, (m.bySize.get(rec.size) ?? 0) + rec.amount);
    }
  }

  const keys = [...map.keys()].sort();
  const months: MonthPoint[] = keys.map((k) => {
    const m = map.get(k)!;
    return { period: k, label: monthLabel(m.month, m.year), amount: m.amount, qty: m.qty };
  });

  const monthCount = months.length;
  const empty: Analytics = {
    months,
    momGrowthPct: null,
    bestMonth: null,
    anomalies: [],
    forecast: null,
    monthCount,
  };
  if (monthCount === 0) return empty;

  // Month-over-month growth.
  let momGrowthPct: number | null = null;
  if (monthCount >= 2) {
    const a = months[monthCount - 1].amount;
    const b = months[monthCount - 2].amount;
    momGrowthPct = b > 0 ? ((a - b) / b) * 100 : null;
  }

  const bestMonth = months.reduce((best, m) => (m.amount > best.amount ? m : best), months[0]);

  // Anomalies: Total + top 5 flavors + top 5 sizes (avoid small/noisy categories).
  const totalByFlavor = new Map<string, number>();
  const totalBySize = new Map<string, number>();
  for (const k of keys) {
    const m = map.get(k)!;
    for (const [f, v] of m.byFlavor) totalByFlavor.set(f, (totalByFlavor.get(f) ?? 0) + v);
    for (const [s, v] of m.bySize) totalBySize.set(s, (totalBySize.get(s) ?? 0) + v);
  }
  const topFlavors = [...totalByFlavor.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map((e) => e[0]);
  const topSizes = [...totalBySize.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map((e) => e[0]);

  const anomalies: Anomaly[] = [
    ...detectAnomalies(months, months.map((m) => m.amount), "Total", "Total"),
  ];
  for (const f of topFlavors) {
    const series = keys.map((k) => map.get(k)!.byFlavor.get(f) ?? 0);
    anomalies.push(...detectAnomalies(months, series, "Rasa", f));
  }
  for (const s of topSizes) {
    const series = keys.map((k) => map.get(k)!.bySize.get(s) ?? 0);
    anomalies.push(...detectAnomalies(months, series, "Ukuran", s));
  }
  anomalies.sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct));
  const topAnomalies = anomalies.slice(0, 8);

  // Next-month forecast (linear regression on the monthly totals).
  let forecast: Forecast = null;
  if (monthCount >= 2) {
    const { slope, intercept } = linreg(months.map((m) => m.amount));
    const predicted = Math.max(0, Math.round(slope * monthCount + intercept));
    const last = map.get(keys[keys.length - 1])!;
    const np = nextPeriod(last.year, last.month);
    forecast = { label: monthLabel(np.month, np.year), amount: predicted };
  }

  return { months, momGrowthPct, bestMonth, anomalies: topAnomalies, forecast, monthCount };
}

// Load all sales reports and compute analytics. Shared by the analytics page
// and the AI-narrative server action so the query/mapping lives in one place.
export async function getSalesAnalytics(): Promise<Analytics> {
  const reports = await prisma.salesReport.findMany({
    include: { records: true },
  });
  return computeAnalytics(
    reports.map((r) => ({
      periodYear: r.periodYear,
      periodMonth: r.periodMonth,
      totalAmount: r.totalAmount,
      totalQty: r.totalQty,
      records: r.records.map((rec) => ({
        flavor: rec.flavor,
        size: rec.size,
        qty: rec.qty,
        amount: rec.amount,
      })),
    }))
  );
}
