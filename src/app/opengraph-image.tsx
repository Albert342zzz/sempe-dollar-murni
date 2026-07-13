import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sempe Dollar Murni — Sempe renyah khas Temanggung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const badge = {
  display: "flex",
  padding: "10px 24px",
  borderRadius: 999,
  border: "2px solid rgba(166,75,42,0.35)",
  backgroundColor: "rgba(166,75,42,0.08)",
  color: "#a64b2a",
  fontSize: 26,
  fontWeight: 600,
} as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4ebe1",
          color: "#3d2c1e",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            height: 16,
            width: "100%",
            background: "linear-gradient(90deg,#a64b2a,#d4af37,#a64b2a)",
          }}
        />

        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            right: -140,
            bottom: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(212,175,55,0.20)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            padding: "0 90px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 8,
              color: "#8c5a3c",
              fontWeight: 600,
            }}
          >
            SEMPE DOLLAR MURNI
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 800,
              marginTop: 14,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Sempe Renyah Khas Temanggung
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#5b4636",
              marginTop: 26,
            }}
          >
            Beragam rasa · Bersertifikasi Halal MUI · Sejak 1986
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
            <div style={badge}>Halal MUI</div>
            <div style={badge}>10 Varian Rasa</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
