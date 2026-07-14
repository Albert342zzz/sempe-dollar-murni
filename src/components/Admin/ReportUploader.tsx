"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiUploadCloud, FiFile } from "react-icons/fi";
import { uploadReport } from "@/app/admin/reports/actions";
import { MONTH_NAMES } from "@/lib/months";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";

const now = new Date();
const YEARS = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

const selectClass =
  "w-full rounded-lg border border-brown/20 bg-cream-soft px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta";

export default function ReportUploader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2.5 text-sm text-white transition hover:bg-brown"
      >
        <FiUploadCloud /> Unggah Laporan
      </button>

      {open && (
        <Modal
          title="Unggah Rincian Penjualan"
          icon={<FiUploadCloud className="text-xl" />}
          onClose={() => setOpen(false)}
          dismissable={!pending}
        >
          <p className="text-sm text-ink/60">
            Pilih periode lalu unggah file Excel (.xlsx/.xls, maks 5 MB).
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
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
          </div>

          <label
            className={`mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-brown/20 bg-cream-soft px-4 py-2.5 text-sm text-ink transition hover:bg-cream ${
              pending ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <FiFile className="text-base" />
            {file ? "Ganti file" : "Pilih file Excel"}
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

          {file && (
            <p className="mt-2 truncate text-xs text-ink/50">
              File terpilih: <span className="text-ink/70">{file.name}</span>
            </p>
          )}
          {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => !pending && setOpen(false)}
              className="rounded-lg border border-brown/20 px-4 py-2 text-sm text-ink/70 transition hover:bg-cream-soft"
            >
              Batal
            </button>
            <button
              onClick={submit}
              disabled={!file || pending}
              className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending && <Spinner className="h-4 w-4" />}
              {pending ? "Memproses..." : "Unggah"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
