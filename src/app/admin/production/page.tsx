import Link from "next/link";
import { FiPackage, FiFileText, FiUploadCloud } from "react-icons/fi";
import { getProductionPlan, type PlanItem } from "@/lib/production-plan";
import ProductionInsightButton from "@/components/Admin/ProductionInsightButton";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink/50">{sub}</p>}
    </div>
  );
}

function PlanTable({
  title,
  head,
  items,
}: {
  title: string;
  head: string;
  items: PlanItem[];
}) {
  const max = Math.max(1, ...items.map((i) => i.recommended));
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-6">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mb-4 text-sm text-ink/50">
        Prakiraan jumlah untuk bulan depan (pcs)
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brown/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-3 py-2 font-medium">{head}</th>
              <th className="px-3 py-2 text-right font-medium">Bulan Lalu</th>
              <th className="px-3 py-2 text-right font-medium">Rata-rata</th>
              <th className="px-3 py-2 text-right font-medium">Disarankan</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => {
              const delta = i.recommended - i.lastMonth;
              return (
                <tr
                  key={i.name}
                  className="border-b border-brown/5 last:border-0 hover:bg-cream-soft"
                >
                  <td className="px-3 py-2 text-ink/80">{i.name}</td>
                  <td className="px-3 py-2 text-right text-ink/60">
                    {i.lastMonth}
                  </td>
                  <td className="px-3 py-2 text-right text-ink/60">
                    {i.average}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-brown/10 sm:block">
                        <span
                          className="block h-full rounded-full bg-terracotta/70"
                          style={{ width: `${(i.recommended / max) * 100}%` }}
                        />
                      </span>
                      <span className="w-10 text-right font-semibold text-ink tabular-nums">
                        {i.recommended}
                      </span>
                      {delta !== 0 && (
                        <span
                          className={`w-9 text-right text-xs tabular-nums ${
                            delta > 0 ? "text-olive" : "text-red-600"
                          }`}
                        >
                          {delta > 0 ? "+" : ""}
                          {delta}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function ProductionPage() {
  const plan = await getProductionPlan();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Rencana Produksi</h1>
        <p className="text-sm text-ink/60">
          Prakiraan kebutuhan produksi bulan depan per rasa &amp; ukuran, dihitung
          dari tren penjualan.
        </p>
      </div>

      {plan.monthCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-brown/25 bg-cream p-12 text-center">
          <FiFileText className="mx-auto text-4xl text-brown/50" />
          <h2 className="mt-4 text-lg font-semibold text-ink">Belum ada data</h2>
          <p className="mt-2 text-sm text-ink/60">
            Unggah minimal satu laporan penjualan untuk menyusun rencana produksi.
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
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Rencana Untuk" value={plan.nextLabel ?? "—"} />
            <StatCard
              label="Total Disarankan"
              value={`${plan.totalRecommended} pcs`}
              sub={
                plan.totalLastMonth > 0
                  ? `${plan.totalRecommended - plan.totalLastMonth >= 0 ? "+" : ""}${
                      plan.totalRecommended - plan.totalLastMonth
                    } pcs vs bulan lalu`
                  : undefined
              }
            />
            <StatCard
              label="Dasar Perhitungan"
              value={plan.basis === "trend" ? "Tren" : "1 Bulan"}
              sub={
                plan.basis === "trend"
                  ? `Regresi ${plan.monthCount} bulan`
                  : "Mengikuti bulan terakhir"
              }
            />
          </div>

          {plan.basis === "single-month" && (
            <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink/70">
              Baru ada 1 bulan data — angka ini mengikuti penjualan bulan terakhir.
              Rekomendasi akan makin akurat seiring bertambahnya laporan.
            </p>
          )}

          {/* Plan tables */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <PlanTable title="Per Rasa" head="Rasa" items={plan.byFlavor} />
            <PlanTable title="Per Ukuran" head="Ukuran" items={plan.bySize} />
          </div>

          {/* AI recommendation */}
          <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
            <div className="flex items-center gap-2">
              <FiPackage className="text-terracotta" />
              <h2 className="text-lg font-semibold text-ink">Rekomendasi AI</h2>
            </div>
            <p className="mb-4 mt-1 text-sm text-ink/50">
              Ringkasan naratif dari angka prakiraan (agregat saja).
            </p>
            <ProductionInsightButton />
          </div>
        </>
      )}
    </div>
  );
}
