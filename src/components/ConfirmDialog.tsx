"use client";

import { FiAlertTriangle } from "react-icons/fi";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";

// Confirmation dialog built on the shared Modal — an on-brand replacement for
// window.confirm(). Stays open (and undismissable) while `pending` is true.
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  danger = true,
  pending = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      icon={<FiAlertTriangle />}
      onClose={onCancel}
      dismissable={!pending}
    >
      <div className="text-sm leading-relaxed text-ink/70">{message}</div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={pending}
          className="cursor-pointer rounded-lg border border-brown/20 px-4 py-2 text-sm text-ink/70 transition hover:bg-cream-soft disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={pending}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
            danger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-terracotta hover:bg-brown"
          }`}
        >
          {pending && <Spinner className="h-4 w-4" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
