import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { prisma } from "@/lib/prisma";

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

  const { nickname, phone } = body;
  if (!nickname?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "Nama panggilan dan nomor HP wajib diisi." },
      { status: 400 }
    );
  }

  const email = user.email ?? "";

  // New registrations are always USER. Only another admin can promote via /admin/users.
  const profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      email,
      nickname: nickname.trim(),
      phone: phone.trim(),
      role: "USER",
    },
    update: {
      email,
      nickname: nickname.trim(),
      phone: phone.trim(),
    },
  });

  return NextResponse.json(profile, { status: 201 });
}
