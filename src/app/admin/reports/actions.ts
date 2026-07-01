"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";
import { parseSalesWorkbook, aggregate } from "@/lib/sales-parser";
import { buildInsight } from "@/lib/sales-insight";
import { monthLabel } from "@/lib/months";

export type UploadState = {
  ok: boolean;
  error?: string;
  reportId?: number;
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadReport(formData: FormData): Promise<UploadState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const file = formData.get("file");
  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "File tidak ditemukan." };
  }
  if (!/\.xlsx?$/i.test(file.name)) {
    return { ok: false, error: "Format harus .xlsx atau .xls." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Ukuran file maksimal 5 MB." };
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { ok: false, error: "Bulan tidak valid." };
  }
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return { ok: false, error: "Tahun tidak valid." };
  }

  let parsed;
  try {
    const buffer = await file.arrayBuffer();
    parsed = parseSalesWorkbook(buffer);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Gagal membaca file Excel.",
    };
  }

  const { records, aggregates: a, skippedRowNumbers } = parsed;
  if (records.length === 0) {
    return {
      ok: false,
      error: "Tidak ada baris penjualan yang terbaca. Periksa kembali file.",
    };
  }

  const summary = await buildInsight(a, monthLabel(month, year));

  const report = await prisma.salesReport.create({
    data: {
      filename: file.name,
      periodMonth: month,
      periodYear: year,
      totalAmount: a.totalAmount,
      totalQty: a.totalQty,
      validRows: a.validRows,
      skippedRows: a.skippedRows,
      skippedRowNums: skippedRowNumbers,
      aiSummary: summary,
      records: {
        create: records.map((r) => ({
          flavor: r.flavor,
          size: r.size,
          qty: r.qty,
          unitPrice: r.unitPrice,
          amount: r.amount,
        })),
      },
    },
  });

  revalidatePath("/admin/reports");
  return { ok: true, reportId: report.id };
}

// Records are deleted via cascade (Prisma relation).
export async function deleteReport(id: number): Promise<UploadState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };
  await prisma.salesReport.delete({ where: { id } });
  revalidatePath("/admin/reports");
  return { ok: true };
}

export async function regenerateInsight(id: number): Promise<UploadState> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const report = await prisma.salesReport.findUnique({
    where: { id },
    include: { records: true },
  });
  if (!report) return { ok: false, error: "Laporan tidak ditemukan." };

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

  const summary = await buildInsight(
    a,
    monthLabel(report.periodMonth, report.periodYear)
  );
  await prisma.salesReport.update({
    where: { id },
    data: { aiSummary: summary },
  });

  revalidatePath(`/admin/reports/${id}`);
  return { ok: true, reportId: id };
}
