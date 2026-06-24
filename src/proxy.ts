import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(req: NextRequest) {
  // Refresh the customer Supabase session on every page.
  const response = await updateSession(req);

  // Protect /admin pages with the separate admin JWT cookie.
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!(await verifySession(token))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // All pages except API routes, auth callback, and static assets.
    "/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
