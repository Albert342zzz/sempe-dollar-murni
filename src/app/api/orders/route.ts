import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/user";

// GET /api/orders — list all orders (used by the admin dashboard).
export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

type OrderItemInput = { flavorId: string; sizeLabel: string; qty: number };

// POST /api/orders — create a new order from the cart checkout.
export async function POST(req: Request) {
  let body: {
    customerName?: string;
    phone?: string;
    items?: OrderItemInput[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON." }, { status: 400 });
  }

  const { customerName, phone, items } = body;

  if (!customerName || !phone || !items?.length) {
    return NextResponse.json(
      { error: "customerName, phone, dan items wajib diisi." },
      { status: 400 }
    );
  }

  // Resolve prices from the DB — never trust prices sent by the client.
  const flavorPrices = await prisma.flavorPrice.findMany({
    include: { size: true },
  });
  const priceByKey = new Map(
    flavorPrices.map((fp) => [`${fp.flavorId}__${fp.size.label}`, fp.price])
  );

  let total = 0;
  const itemsData = items.map((it) => {
    const price = priceByKey.get(`${it.flavorId}__${it.sizeLabel}`) ?? 0;
    total += price * it.qty;
    return {
      flavorId: it.flavorId,
      sizeLabel: it.sizeLabel,
      qty: it.qty,
      price,
    };
  });

  const user = await getCurrentUser();

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      userId: user?.id ?? null,
      total,
      items: { create: itemsData },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
