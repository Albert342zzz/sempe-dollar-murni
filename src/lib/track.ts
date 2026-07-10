// Client-side helper: fire-and-forget first-party analytics events.
// Uses sendBeacon so the request survives navigation (e.g. clicking a link
// that opens WhatsApp), falling back to keepalive fetch.
export function track(type: string, meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      type,
      path: window.location.pathname,
      meta,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", body);
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true });
    }
  } catch {
    // Never let analytics break the user's action.
  }
}
