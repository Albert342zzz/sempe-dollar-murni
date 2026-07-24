"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiRefreshCw } from "react-icons/fi";
import { deleteReport, regenerateInsight } from "@/app/admin/reports/actions";
import ConfirmDialog from "@/components/ConfirmDialog";
import Spinner from "@/components/Spinner";

export function DeleteReportButton({
  id,
  filename,
  redirectTo,
}: {
  id: number;
  filename: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteReport(id);
      if (!res.ok) {
        window.alert(res.error ?? "Gagal menghapus.");
        return;
      }
      setConfirming(false);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        disabled={pending}
        title="Hapus laporan"
        aria-label="Hapus laporan"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-ink/50 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      >
        {pending ? <Spinner className="h-4 w-4" /> : <FiTrash2 />}
      </button>

      {confirming && (
        <ConfirmDialog
          title="Hapus laporan?"
          message={
            <>
              <span className="font-medium text-ink">{filename}</span> akan
              dihapus permanen beserta seluruh baris penjualannya. Tindakan ini
              tidak bisa dibatalkan.
            </>
          }
          confirmLabel="Ya, hapus"
          pending={pending}
          onConfirm={handleDelete}
          onCancel={() => !pending && setConfirming(false)}
        />
      )}
    </>
  );
}

export function RegenerateInsightButton({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRegen() {
    startTransition(async () => {
      const res = await regenerateInsight(id);
      if (!res.ok) window.alert(res.error ?? "Gagal.");
      else router.refresh();
    });
  }

  return (
    <button
      onClick={handleRegen}
      disabled={pending}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brown/20 px-3 py-1.5 text-xs text-ink/70 transition hover:bg-cream-soft disabled:opacity-50"
    >
      {pending ? <Spinner className="h-3.5 w-3.5" /> : <FiRefreshCw className="text-sm" />}
      Buat ulang
    </button>
  );
}
