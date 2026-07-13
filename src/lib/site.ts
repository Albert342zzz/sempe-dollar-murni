// Canonical public site URL. Used for SEO metadata, the sitemap, and robots.
// Set NEXT_PUBLIC_SITE_URL in the environment; falls back to the production domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sempedollarmurni.com";
