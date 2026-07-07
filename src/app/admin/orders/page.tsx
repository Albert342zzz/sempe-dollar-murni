import { prisma } from "@/lib/prisma";
import OrderManager from "@/components/Admin/OrderManager";
import { getFlavor } from "@/lib/flavors";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const data = orders.map((o) => ({
    id: o.id,
    customerName: o.customerName,
    phone: o.phone,
    status: o.status as "BARU" | "DIPROSES" | "SELESAI" | "DIBATALKAN",
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((it) => ({
      flavorName: getFlavor(it.flavorId)?.name ?? it.flavorId,
      sizeLabel: it.sizeLabel,
      qty: it.qty,
    })),
  }));

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Pesanan</h1>
        <p className="text-sm text-ink/60">
          Kelola pesanan masuk dan perbarui statusnya.
        </p>
      </div>

      <OrderManager orders={data} />
    </div>
  );
}
