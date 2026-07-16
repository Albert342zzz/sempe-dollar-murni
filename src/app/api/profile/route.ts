import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { prisma } from "@/lib/prisma";
import { validateName, validatePhone } from "@/lib/validation";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });
  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { nickname?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON." }, { status: 400 });
  }

  const nickname = (body.nickname ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const nameError = validateName(nickname);
  if (nameError) return NextResponse.json({ error: nameError }, { status: 400 });
  const phoneError = validatePhone(phone);
  if (phoneError)
    return NextResponse.json({ error: phoneError }, { status: 400 });

  const email = user.email ?? "";

  const existing = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    const profile = await prisma.userProfile.update({
      where: { userId: user.id },
      data: { email, nickname, phone },
    });
    return NextResponse.json(profile, { status: 201 });
  }

  // First-time profile. Self-registrations are always USER, but an admin may
  // have pre-authorized this email in /admin/users — that invite decides the
  // role and is consumed here.
  const invite = email
    ? await prisma.userInvite.findUnique({ where: { email: email.toLowerCase() } })
    : null;

  const profile = await prisma.userProfile.create({
    data: {
      userId: user.id,
      email,
      nickname,
      phone,
      role: invite?.role ?? "USER",
    },
  });

  if (invite) {
    await prisma.userInvite.delete({ where: { id: invite.id } });
  }

  const res = NextResponse.json(profile, { status: 201 });

  // Invited admins get their admin cookie right away, so they don't have to
  // log out and back in before /admin becomes reachable.
  if (profile.role === "ADMIN") {
    res.cookies.set(SESSION_COOKIE, await createSession(email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
  }

  return res;
}
