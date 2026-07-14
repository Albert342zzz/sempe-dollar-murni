"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

// Simple modal rendered via a portal to document.body (so it escapes any
// overflow/transform container), with a blurred overlay and a close button.
// Set `dismissable` = false to prevent closing during work (e.g. while uploading).
export default function Modal({
  title,
  icon,
  onClose,
  children,
  dismissable = true,
}: {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  dismissable?: boolean;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && dismissable) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, dismissable]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => dismissable && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-brown/15 bg-cream p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
              {icon}
            </span>
          )}
          <h2 className="flex-1 text-lg font-semibold text-ink">{title}</h2>
          <button
            onClick={() => dismissable && onClose()}
            disabled={!dismissable}
            aria-label="Tutup"
            className="rounded-lg p-1.5 text-ink/40 transition hover:bg-cream-soft hover:text-ink disabled:opacity-40"
          >
            <FiX />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
