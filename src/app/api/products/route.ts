import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products — ambil daftar rasa & ukuran dari database.
export async function GET() {
  const [flavors, sizes] = await Promise.all([
    prisma.flavor.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.size.findMany({ orderBy: { price: "asc" } }),
  ]);

  return NextResponse.json({ flavors, sizes });
}
