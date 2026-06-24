import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PriceMap } from "@/lib/prices";

// GET /api/products — fetch flavors, sizes, and per-flavor prices from the DB.
export async function GET() {
  const [flavors, sizes, flavorPrices] = await Promise.all([
    prisma.flavor.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.size.findMany({ orderBy: { price: "asc" } }),
    prisma.flavorPrice.findMany({ include: { size: true } }),
  ]);

  // Build price map: flavorId -> { sizeLabel -> price }.
  const prices: PriceMap = {};
  for (const fp of flavorPrices) {
    (prices[fp.flavorId] ??= {})[fp.size.label] = fp.price;
  }

  return NextResponse.json({ flavors, sizes, prices });
}
