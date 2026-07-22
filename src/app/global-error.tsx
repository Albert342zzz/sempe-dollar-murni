"use client";

import { useEffect } from "react";

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the whole document, so it must render its own <html>/<body> and cannot rely
// on Tailwind (globals.css isn't loaded here) — styles are inlined.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "2rem",
          textAlign: "center",
          background: "#fbf6ef",
          color: "#3d2c1e",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <p style={{ fontSize: "4rem", fontWeight: 600, color: "#a64b2a", margin: 0 }}>
          500
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Ada yang tidak beres
        </h1>
        <p style={{ maxWidth: "28rem", color: "rgba(61,44,30,0.6)", margin: 0 }}>
          Maaf, terjadi kendala di sisi kami. Coba muat ulang halaman ini.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            border: "none",
            borderRadius: "9999px",
            background: "#a64b2a",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Coba Lagi
        </button>
      </body>
    </html>
  );
}
