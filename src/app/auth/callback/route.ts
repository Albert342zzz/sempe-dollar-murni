import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

// OAuth callback: exchange `code` for a session, then redirect back.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const userId = data.session.user.id;
      const email = data.session.user.email ?? "";

      try {
        const profile = await prisma.userProfile.findUnique({
          where: { userId },
        });

        if (!profile) {
          // New user — collect nickname + phone first.
          return NextResponse.redirect(
            `${origin}/complete-profile?next=${encodeURIComponent(next)}`
          );
        }

        // Profile exists — redirect to destination, setting admin JWT if applicable.
        const destination = NextResponse.redirect(`${origin}${next}`);

        if (profile.role === "ADMIN") {
          const token = await createSession(email || profile.email);
          destination.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
        }

        return destination;
      } catch (e) {
        console.error("[auth/callback] profile check failed:", e);
        // Fail open: session is valid, still redirect.
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
