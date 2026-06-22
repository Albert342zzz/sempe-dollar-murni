import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

// GET /api/admin/logout — hapus cookie sesi lalu kembali ke halaman login.
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
