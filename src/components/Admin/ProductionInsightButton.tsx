"use client";

import { useState, useTransition } from "react";
import { FiCpu, FiRefreshCw } from "react-icons/fi";
import { generateProductionInsight } from "@/app/admin/production/actions";
import Spinner from "@/components/Spinner";

export default function ProductionInsightButton() {
  const [pending, start] = useTransition();
  const [text, setText] = useState<string | null>(null);

  function run() {
    start(async () => {
      const res = await generateProductionInsight();
      setText(res.ok ? (res.text ?? "") : (res.error ?? "Gagal membuat rekomendasi."));
    });
  }

  return (
    <div>
      {text ? (
        <p className="whitespace-pre-line leading-relaxed text-ink/80">{text}</p>
      ) : (
        <p className="text-sm text-ink/50">
          Buat rekomendasi produksi naratif dari angka prakiraan di atas.
        </p>
      )}

      <button
        onClick={run}
        disabled={pending}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Spinner className="h-4 w-4" /> : text ? <FiRefreshCw /> : <FiCpu />}
        {pending ? "Menganalisis…" : text ? "Buat ulang" : "Buat rekomendasi AI"}
      </button>
    </div>
  );
}
