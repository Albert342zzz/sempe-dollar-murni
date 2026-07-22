"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

// Route-level error boundary. Catches render/data errors in any page under the
// root layout and shows a friendly, on-brand fallback instead of a raw crash.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <ErrorState
      code="500"
      title="Ada yang tidak beres"
      message="Maaf, terjadi kendala di sisi kami. Coba muat ulang halaman ini, atau kembali ke beranda."
      onRetry={reset}
    />
  );
}
