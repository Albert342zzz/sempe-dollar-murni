import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/require-admin";
import { readImageFile } from "@/lib/gallery-upload";

export const runtime = "nodejs";

// POST /api/admin/gallery — add a gallery photo (called via XHR to support an upload progress bar).
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const img = await readImageFile(form.get("file"));
  if ("error" in img) {
    return NextResponse.json({ error: img.error }, { status: 400 });
  }

  const alt = String(form.get("alt") ?? "").trim() || "Foto galeri";
  const last = await prisma.galleryImage.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.galleryImage.create({
    data: {
      data: img.data,
      mimeType: img.mimeType,
      alt,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
