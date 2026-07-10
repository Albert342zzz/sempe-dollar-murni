import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";

// Event kinds we accept. Anything else is ignored so the table stays clean.
const ALLOWED_TYPES = new Set(["wa_click", "product_view"]);

// Basic bot filter. These events already require JS (a real click/view), so
// most bots never reach here; this drops the obvious link-preview crawlers.
const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|headless|monitor|preview/i;

// POST /api/track — record a first-party analytics event. Always returns 204
// so tracking failures never affect the visitor.
export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) return new Response(null, { status: 204 });

  let body: { type?: unknown; path?: unknown; meta?: unknown };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 204 });
  }

  const type = typeof body.type === "string" ? body.type : "";
  if (!ALLOWED_TYPES.has(type)) return new Response(null, { status: 204 });

  const path = typeof body.path === "string" ? body.path.slice(0, 256) : null;

  // Keep only a small, plain JSON object as meta.
  let meta: Prisma.InputJsonValue | undefined;
  if (body.meta && typeof body.meta === "object") {
    const serialized = JSON.stringify(body.meta);
    if (serialized.length <= 1024) meta = body.meta as Prisma.InputJsonValue;
  }

  try {
    await prisma.siteEvent.create({
      data: { type, path, ...(meta ? { meta } : {}) },
    });
  } catch {
    // Swallow — analytics must never surface an error to the client.
  }
  return new Response(null, { status: 204 });
}
