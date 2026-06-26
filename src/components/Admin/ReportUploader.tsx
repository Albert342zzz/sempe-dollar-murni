"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiUploadCloud, FiFile } from "react-icons/fi";
import { uploadReport } from "@/app/admin/reports/actions";
import { MONTH_NAMES } from "@/lib/months";
import Spinner from "@/components/Spinner";

const now = new Date();
const YEARS = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

const selectClass =
  "rounded-lg border border-brown/20 bg-cream-soft px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta";

export default function ReportUploader() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", String(month));
    formData.append("year", String(year));

    startTransition(async () => {
      const res = await uploadReport(formData);
      if (!res.ok) {
        setError(res.error ?? "Gagal mengunggah.");
        return;
      }
      router.push(`/admin/reports/${res.reportId}`);
    });
  }

  return (
    <div className="rounded-2xl border border-dashed border-brown/30 bg-cream p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          {pending ? <Spinner className="h-5 w-5" /> : <FiUploadCloud className="text-2xl" />}
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Unggah Rincian Penjualan</p>
          <p className="text-xs text-ink/50">
            Pilih periode lalu unggah file Excel (.xlsx/.xls, maks 5 MB).
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        {/* Period selector */}
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Bulan</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            disabled={pending}
            className={selectClass}
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Tahun</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            disabled={pending}
            className={selectClass}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* File picker */}
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brown/20 bg-cream-soft px-4 py-2 text-sm text-ink transition hover:bg-cream ${
            pending ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <FiFile className="text-base" />
          {file ? "Ganti file" : "Pilih file"}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            disabled={pending}
            onChange={(e) => {
              setError(null);
              setFile(e.target.files?.[0] ?? null);
            }}
          />
        </label>

        {/* Upload button */}
        <button
          onClick={submit}
          disabled={!file || pending}
          className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Spinner className="h-4 w-4" />}
          {pending ? "Memproses..." : "Unggah"}
        </button>
      </div>

      {file && !pending && (
        <p className="mt-3 truncate text-xs text-ink/50">
          File terpilih: <span className="text-ink/70">{file.name}</span>
        </p>
      )}
      {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}
    </div>
  );
}
