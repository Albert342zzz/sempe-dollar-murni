import Link from "next/link";
import { FiTrendingUp, FiTrendingDown, FiFileText, FiUploadCloud } from "react-icons/fi";
import { formatRupiah } from "@/lib/flavors";
import { getSalesAnalytics } from "@/lib/sales-analytics";
import { TrendLineChart } from "@/components/Admin/charts/SalesCharts";
import TrendInsightButton from "@/components/Admin/TrendInsightButton";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${
          tone === "up" ? "text-olive" : tone === "down" ? "text-red-600" : "text-ink"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink/50">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const a = await getSalesAnalytics();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Analitik Penjualan</h1>
        <p className="text-sm text-ink/60">
          Tren, anomali, dan prakiraan lintas laporan penjualan.
        </p>
      </div>

      {a.monthCount < 2 ? (
        <div className="rounded-2xl border border-dashed border-brown/25 bg-cream p-12 text-center">
          <FiFileText className="mx-auto text-4xl text-brown/50" />
          <h2 className="mt-4 text-lg font-semibold text-ink">
            Perlu data lebih banyak
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            Analisis tren butuh minimal 2 laporan dari bulan berbeda. Baru ada{" "}
            {a.monthCount} bulan.
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
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Pertumbuhan Bulan Terakhir"
              value={
                a.momGrowthPct === null
                  ? "—"
                  : `${a.momGrowthPct >= 0 ? "+" : ""}${a.momGrowthPct.toFixed(0)}%`
              }
              sub="vs bulan sebelumnya"
              tone={
                a.momGrowthPct === null
                  ? undefined
                  : a.momGrowthPct >= 0
                    ? "up"
                    : "down"
              }
            />
            <StatCard
              label="Bulan Terbaik"
              value={a.bestMonth ? a.bestMonth.label : "—"}
              sub={a.bestMonth ? formatRupiah(a.bestMonth.amount) : undefined}
            />
            <StatCard
              label="Prakiraan Bulan Depan"
              value={a.forecast ? formatRupiah(a.forecast.amount) : "—"}
              sub={a.forecast ? a.forecast.label : "perlu ≥2 bulan"}
            />
          </div>

          {/* Trend line */}
          <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
            <h2 className="text-lg font-semibold text-ink">Tren Penjualan</h2>
            <p className="mb-5 text-sm text-ink/50">
              Total penjualan tiap bulan ({a.monthCount} periode)
            </p>
            <TrendLineChart
              data={a.months.map((m) => ({ label: m.label, amount: m.amount }))}
            />
          </div>

          {/* Anomalies */}
          <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
            <h2 className="text-lg font-semibold text-ink">Anomali Menonjol</h2>
            <p className="mb-4 text-sm text-ink/50">
              Bulan yang jauh dari rata-rata (≥30% &amp; signifikan secara statistik)
            </p>
            {a.anomalies.length === 0 ? (
              <p className="text-sm text-ink/50">
                Tidak ada anomali menonjol — penjualan relatif stabil.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {a.anomalies.map((an, i) => {
                  const up = an.direction === "naik";
                  return (
                    <li
                      key={`${an.dimension}-${an.name}-${an.period}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-brown/10 bg-cream-soft px-4 py-2.5 text-sm"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          up ? "bg-olive/15 text-olive" : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {up ? <FiTrendingUp /> : <FiTrendingDown />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-ink/80">
                          <span className="font-medium">{an.label}</span> ·{" "}
                          {an.dimension === "Total"
                            ? "Total"
                            : `${an.dimension} ${an.name}`}
                        </p>
                        <p className="text-xs text-ink/50">
                          {formatRupiah(an.value)} vs rata-rata{" "}
                          {formatRupiah(Math.round(an.mean))}
                        </p>
                      </div>
                      <span
                        className={`ml-auto shrink-0 font-semibold ${
                          up ? "text-olive" : "text-red-600"
                        }`}
                      >
                        {an.deviationPct >= 0 ? "+" : ""}
                        {an.deviationPct.toFixed(0)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* AI narrative */}
          <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
            <h2 className="text-lg font-semibold text-ink">Analisis AI</h2>
            <p className="mb-4 text-sm text-ink/50">
              Ringkasan naratif dari tren &amp; anomali (angka agregat saja).
            </p>
            <TrendInsightButton />
          </div>
        </>
      )}
    </div>
  );
}
