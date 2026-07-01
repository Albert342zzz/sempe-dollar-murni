import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/flavors";
import { monthLabel } from "@/lib/months";
import { aggregate } from "@/lib/sales-parser";
import { BreakdownChart } from "@/components/Admin/charts/SalesCharts";
import {
  DeleteReportButton,
  RegenerateInsightButton,
} from "@/components/Admin/ReportControls";

export const dynamic = "force-dynamic";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink/50">{sub}</p>}
    </div>
  );
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reportId = Number(id);
  if (!Number.isInteger(reportId)) notFound();

  const report = await prisma.salesReport.findUnique({
    where: { id: reportId },
    include: { records: true },
  });
  if (!report) notFound();

  // Re-compute aggregates from stored records (source of truth for all figures).
  const a = aggregate(
    report.records.map((r) => ({
      flavor: r.flavor,
      size: r.size,
      qty: r.qty,
      unitPrice: r.unitPrice,
      amount: r.amount,
    })),
    report.skippedRows
  );

  const period = monthLabel(report.periodMonth, report.periodYear);

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/admin/reports"
        className="inline-flex items-center gap-2 text-sm text-ink/60 transition hover:text-terracotta"
      >
        <FiArrowLeft /> Kembali ke daftar
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Laporan {period}</h1>
          <p className="text-sm text-ink/60">
            {report.filename} · diunggah{" "}
            {report.uploadedAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <DeleteReportButton
          id={report.id}
          filename={`Laporan ${period}`}
          redirectTo="/admin/reports"
        />
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Penjualan" value={formatRupiah(a.totalAmount)} />
        <StatCard label="Total Terjual" value={`${a.totalQty} pcs`} />
        <StatCard label="Jenis Produk" value={String(a.byProduct.length)} sub="kombinasi rasa × ukuran" />
      </div>

      {/* AI insight */}
      <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Ringkasan Insight</h2>
          <RegenerateInsightButton id={report.id} />
        </div>
        <p className="mt-3 leading-relaxed text-ink/80">
          {report.aiSummary ?? "Belum ada ringkasan."}
        </p>
      </div>

      {/* Breakdown charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brown/15 bg-cream p-6">
          <h2 className="text-lg font-semibold text-ink">Penjualan per Rasa</h2>
          <p className="mb-5 text-sm text-ink/50">Total per rasa</p>
          <BreakdownChart data={a.byFlavor} />
        </div>
        <div className="rounded-2xl border border-brown/15 bg-cream p-6">
          <h2 className="text-lg font-semibold text-ink">Penjualan per Ukuran</h2>
          <p className="mb-5 text-sm text-ink/50">Total per varian ukuran</p>
          <BreakdownChart data={a.bySize} />
        </div>
      </div>

      {/* Product table */}
      <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Rincian per Produk ({a.byProduct.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brown/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-3 py-2 font-medium">Produk</th>
                <th className="px-3 py-2 font-medium text-right">Qty</th>
                <th className="px-3 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {a.byProduct.map((p) => (
                <tr key={p.label} className="border-b border-brown/5 last:border-0">
                  <td className="px-3 py-2 text-ink/80">{p.label}</td>
                  <td className="px-3 py-2 text-right text-ink/70">{p.qty}</td>
                  <td className="px-3 py-2 text-right font-medium text-ink">
                    {formatRupiah(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {report.skippedRows > 0 && (
          <p className="mt-3 text-xs text-ink/40">
            {report.skippedRows} baris total/rekap
            {report.skippedRowNums.length > 0 && (
              <>
                {" "}(baris Excel ke{" "}
                <span className="font-medium text-ink/60">
                  {report.skippedRowNums.join(", ")}
                </span>
                ){" "}
              </>
            )}{" "}
            diabaikan otomatis — total sudah dihitung ulang dari data penjualan,
            jadi tidak dobel.
          </p>
        )}
      </div>
    </div>
  );
}
