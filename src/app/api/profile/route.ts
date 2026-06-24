import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { prisma } from "@/lib/prisma";
import { validateName, validatePhone } from "@/lib/validation";

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

  // New registrations are always USER. Only another admin can promote via /admin/users.
  const profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      email,
      nickname,
      phone,
      role: "USER",
    },
    update: {
      email,
      nickname,
      phone,
    },
  });

  return NextResponse.json(profile, { status: 201 });
}
