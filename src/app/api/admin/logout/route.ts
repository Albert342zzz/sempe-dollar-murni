import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/logout — clear admin JWT cookie + Supabase session, redirect to login.
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
