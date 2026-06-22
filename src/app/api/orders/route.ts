import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders — daftar pesanan (untuk dashboard admin).
export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

type OrderItemInput = { flavorId: string; sizeLabel: string; qty: number };

// POST /api/orders — buat pesanan baru (checkout dari keranjang).
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

  // Ambil harga dari database (jangan percaya harga dari klien).
  const sizes = await prisma.size.findMany();
  const priceByLabel = new Map(sizes.map((s) => [s.label, s.price]));

  let total = 0;
  const itemsData = items.map((it) => {
    const price = priceByLabel.get(it.sizeLabel) ?? 0;
    total += price * it.qty;
    return {
      flavorId: it.flavorId,
      sizeLabel: it.sizeLabel,
      qty: it.qty,
      price,
    };
  });

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      total,
      items: { create: itemsData },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
