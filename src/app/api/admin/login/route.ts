import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

// POST /api/admin/login — verifikasi kredensial admin, set cookie sesi.
export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON." }, { status: 400 });
  }

  const { email, password } = body;

  if (
    !email ||
    !password ||
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Email atau kata sandi salah." },
      { status: 401 }
    );
  }

  const token = await createSession(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
  return res;
}
