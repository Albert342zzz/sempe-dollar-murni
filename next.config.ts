import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Uploads go through Server Actions (gallery photos <=3MB, report Excel <=5MB).
    // The 1MB default is too small.
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    // Allow all local images (as by default) but with any query string —
    // gallery photos are served from /api/gallery/[id]?v=... (cache-bust).
    // `search` is intentionally omitted so any query string is allowed.
    localPatterns: [{ pathname: "/**" }],
  },
};

export default nextConfig;
