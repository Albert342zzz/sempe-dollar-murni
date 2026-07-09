import Link from "next/link";
import { FiFileText, FiUploadCloud } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { flavors, formatRupiah } from "@/lib/flavors";
import { monthLabel } from "@/lib/months";
import { SizePie, SIZE_PIE_COLORS } from "@/components/Admin/charts/SalesCharts";

// Render on each request to read fresh data from the DB; never prerender at
// build time (the build has no database connection).
export const dynamic = "force-dynamic";

const namaBulan = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// Map flavor name → accent color (for the best-selling flavor bars).
const accentByName = new Map(flavors.map((f) => [f.name.toLowerCase(), f.accent]));

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink/50">{sub}</p>
    </div>
  );
}

function SalesBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex h-48 items-end gap-3">
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="flex-1 rounded-t-lg bg-terracotta/80 transition hover:bg-terracotta"
            style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
            title={formatRupiah(d.value)}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`} className="flex-1 text-center text-xs text-ink/60">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function FlavorBars({
  data,
}: {
  data: { name: string; accent: string; sold: number }[];
}) {
  if (data.length === 0) {
    return <p className="text-sm text-ink/50">Belum ada data penjualan.</p>;
  }
  const max = Math.max(...data.map((f) => f.sold), 1);
  return (
    <div className="space-y-4">
      {data.map((f) => (
        <div key={f.name}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink/80">{f.name}</span>
            <span className="text-ink/50">{f.sold}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-cream-soft">
            <div
              className="h-2 rounded-full"
              style={{ width: `${(f.sold / max) * 100}%`, backgroundColor: f.accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboard() {
  const reports = await prisma.salesReport.findMany({
    include: { records: true },
  });

  // Aggregate stats across all reports.
  const totalRevenue = reports.reduce((s, r) => s + r.totalAmount, 0);
  const totalQty = reports.reduce((s, r) => s + r.totalQty, 0);
  const reportCount = reports.length;
  const avgPerReport = reportCount ? Math.round(totalRevenue / reportCount) : 0;

  // Sort by period.
  const byPeriod = [...reports].sort(
    (a, b) => a.periodYear - b.periodYear || a.periodMonth - b.periodMonth
  );
  const latest = byPeriod[byPeriod.length - 1];

  // Monthly sales (last 6 periods at most).
  const monthlySales = byPeriod.slice(-6).map((r) => ({
    label: `${namaBulan[r.periodMonth - 1]} '${String(r.periodYear).slice(2)}`,
    value: r.totalAmount,
  }));

  // Best-selling flavors (accumulated across all reports).
  const soldByFlavor = new Map<string, number>();
  for (const r of reports) {
    for (const rec of r.records) {
      soldByFlavor.set(rec.flavor, (soldByFlavor.get(rec.flavor) ?? 0) + rec.qty);
    }
  }
  const flavorSales = [...soldByFlavor.entries()]
    .map(([name, sold]) => ({
      name,
      accent: accentByName.get(name.toLowerCase()) ?? "#8c5a3c",
      sold,
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6);

  // Sales composition per size (for the pie): top 5 + "Lainnya" (Others).
  const soldBySize = new Map<string, { qty: number; amount: number }>();
  for (const r of reports) {
    for (const rec of r.records) {
      const cur = soldBySize.get(rec.size) ?? { qty: 0, amount: 0 };
      cur.qty += rec.qty;
      cur.amount += rec.amount;
      soldBySize.set(rec.size, cur);
    }
  }
  const sizeArr = [...soldBySize.entries()]
    .map(([label, v]) => ({ label, qty: v.qty, amount: v.amount }))
    .sort((a, b) => b.amount - a.amount);
  const restSizes = sizeArr.slice(5);
  const sizeComposition = restSizes.length
    ? [
        ...sizeArr.slice(0, 5),
        {
          label: "Lainnya",
          qty: restSizes.reduce((s, x) => s + x.qty, 0),
          amount: restSizes.reduce((s, x) => s + x.amount, 0),
        },
      ]
    : sizeArr;
  const totalSizeAmount = sizeComposition.reduce((s, x) => s + x.amount, 0);

  // Most recently uploaded reports.
  const recent = [...reports]
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(0, 5);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/60">
            Ringkasan dari laporan penjualan yang diunggah
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm text-white transition hover:bg-brown"
        >
          <FiUploadCloud /> Kelola Laporan
        </Link>
      </div>

      {reportCount === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-brown/25 bg-cream p-12 text-center">
          <FiFileText className="mx-auto text-4xl text-brown/50" />
          <h2 className="mt-4 text-lg font-semibold text-ink">
            Belum ada data penjualan
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Unggah rincian penjualan (Excel) untuk melihat ringkasan di sini.
          </p>
          <Link
            href="/admin/reports"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
          >
            <FiUploadCloud /> Unggah Laporan
          </Link>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Penjualan"
              value={formatRupiah(totalRevenue)}
              sub={`dari ${reportCount} laporan`}
            />
            <StatCard
              label="Total Terjual"
              value={`${totalQty} pcs`}
              sub="seluruh periode"
            />
            <StatCard
              label="Rata-rata / Laporan"
              value={formatRupiah(avgPerReport)}
              sub="per bulan"
            />
            <StatCard
              label="Periode Terakhir"
              value={latest ? monthLabel(latest.periodMonth, latest.periodYear) : "—"}
              sub="laporan terbaru"
            />
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-brown/15 bg-cream p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-ink">Penjualan per Bulan</h2>
              <p className="mb-6 text-sm text-ink/50">
                Total penjualan tiap periode laporan
              </p>
              <SalesBarChart data={monthlySales} />
            </div>

            <div className="rounded-2xl border border-brown/15 bg-cream p-6">
              <h2 className="text-lg font-semibold text-ink">Rasa Terlaris</h2>
              <p className="mb-6 text-sm text-ink/50">Jumlah terjual per rasa</p>
              <FlavorBars data={flavorSales} />
            </div>
          </div>

          {/* Sales composition per size (pie chart) */}
          {sizeComposition.length > 0 && (
            <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
              <h2 className="text-lg font-semibold text-ink">
                Komposisi Penjualan per Ukuran
              </h2>
              <p className="mb-5 text-sm text-ink/50">
                Porsi nilai penjualan tiap varian berat
              </p>
              <div className="grid items-center gap-6 md:grid-cols-2">
                <SizePie data={sizeComposition} />
                <ul className="space-y-2.5">
                  {sizeComposition.map((s, i) => {
                    const pct = totalSizeAmount
                      ? Math.round((s.amount / totalSizeAmount) * 100)
                      : 0;
                    return (
                      <li
                        key={s.label}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              SIZE_PIE_COLORS[i % SIZE_PIE_COLORS.length],
                          }}
                        />
                        <span className="text-ink/80">{s.label}</span>
                        <span className="ml-auto tabular-nums text-ink/50">
                          {pct}%
                        </span>
                        <span className="w-28 text-right tabular-nums text-ink/70">
                          {formatRupiah(s.amount)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Recent reports */}
          <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
            <h2 className="text-lg font-semibold text-ink">Laporan Terbaru</h2>
            <p className="mb-4 text-sm text-ink/50">Diurutkan dari yang terbaru</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-brown/10 text-xs uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="px-3 py-2 font-medium">Periode</th>
                    <th className="px-3 py-2 font-medium">File</th>
                    <th className="px-3 py-2 font-medium text-right">Terjual</th>
                    <th className="px-3 py-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.id} className="border-b border-brown/5 last:border-0">
                      <td className="px-3 py-2">
                        <Link
                          href={`/admin/reports/${r.id}`}
                          className="font-medium text-ink hover:text-terracotta"
                        >
                          {monthLabel(r.periodMonth, r.periodYear)}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-ink/60">{r.filename}</td>
                      <td className="px-3 py-2 text-right text-ink/70">
                        {r.totalQty} pcs
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-ink">
                        {formatRupiah(r.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
