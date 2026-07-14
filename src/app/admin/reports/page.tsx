import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/flavors";
import { monthLabel } from "@/lib/months";
import ReportUploader from "@/components/Admin/ReportUploader";
import { DeleteReportButton } from "@/components/Admin/ReportControls";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ReportsPage() {
  const reports = await prisma.salesReport.findMany({
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }, { uploadedAt: "desc" }],
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Laporan Penjualan</h1>
        <p className="text-sm text-ink/60">
          Unggah rincian penjualan per bulan — sistem menghitung lalu membuat
          ringkasan & grafik.
        </p>
      </div>

      <ReportUploader />

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-ink">Riwayat Laporan</h2>

        {reports.length === 0 ? (
          <div className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
            Belum ada laporan. Unggah rincian penjualan pertama kamu di atas.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-brown/15 bg-cream">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-brown/10 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Periode</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-right">Terjual</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-brown/5 transition last:border-0 hover:bg-cream-soft"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/reports/${r.id}`}
                        className="font-medium text-ink hover:text-terracotta"
                      >
                        {monthLabel(r.periodMonth, r.periodYear)}
                      </Link>
                      <p className="text-xs text-ink/40">
                        diunggah {fmtDate(r.uploadedAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-ink/60">{r.filename}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">
                      {formatRupiah(r.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-ink/60">
                      {r.totalQty} pcs
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteReportButton
                        id={r.id}
                        filename={monthLabel(r.periodMonth, r.periodYear)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
