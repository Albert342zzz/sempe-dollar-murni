import { prisma } from "@/lib/prisma";
import { getFlavor, formatRupiah } from "@/lib/flavors";
import RecentOrdersTable from "@/components/Admin/RecentOrdersTable";

// Render on each request to read fresh data from the DB; never prerender at
// build time (the build has no database connection).
export const dynamic = "force-dynamic";

const namaBulan = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink/50">{sub}</p>
    </div>
  );
}

function SalesBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex h-48 items-end gap-3">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex-1 rounded-t-lg bg-terracotta/80 transition hover:bg-terracotta"
            style={{ height: `${Math.max((d.value / max) * 100, 2)}%` }}
            title={formatRupiah(d.value)}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-xs text-ink/60">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function FlavorBars({
  data,
}: {
  data: { id: string; name: string; accent: string; sold: number }[];
}) {
  if (data.length === 0) {
    return <p className="text-sm text-ink/50">Belum ada data penjualan.</p>;
  }
  const max = Math.max(...data.map((f) => f.sold), 1);
  return (
    <div className="space-y-4">
      {data.map((f) => (
        <div key={f.id}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink/80">{f.name}</span>
            <span className="text-ink/50">{f.sold}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-cream-soft">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${(f.sold / max) * 100}%`,
                backgroundColor: f.accent,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  // Statistik
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalSold = orders.reduce(
    (s, o) => s + o.items.reduce((a, i) => a + i.qty, 0),
    0
  );
  const uniqueCustomers = new Set(orders.map((o) => o.phone)).size;
  const isThisMonth = (d: Date) =>
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  const thisMonthOrders = orders.filter((o) => isThisMonth(o.createdAt));
  const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + o.total, 0);

  const stats = [
    {
      label: "Total Pendapatan",
      value: formatRupiah(totalRevenue),
      sub: `${formatRupiah(thisMonthRevenue)} bulan ini`,
    },
    {
      label: "Pesanan",
      value: String(orders.length),
      sub: `${thisMonthOrders.length} bulan ini`,
    },
    {
      label: "Produk Terjual",
      value: String(totalSold),
      sub: "total item terjual",
    },
    {
      label: "Pelanggan",
      value: String(uniqueCustomers),
      sub: "nomor unik",
    },
  ];

  // Penjualan 6 bulan terakhir
  const monthlyBuckets = Array.from({ length: 6 }, (_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    return { year: d.getFullYear(), month: d.getMonth(), value: 0 };
  });
  for (const o of orders) {
    const bucket = monthlyBuckets.find(
      (b) =>
        b.year === o.createdAt.getFullYear() &&
        b.month === o.createdAt.getMonth()
    );
    if (bucket) bucket.value += o.total;
  }
  const monthlySales = monthlyBuckets.map((b) => ({
    label: namaBulan[b.month],
    value: b.value,
  }));

  // Rasa terlaris
  const soldByFlavor = new Map<string, number>();
  for (const o of orders) {
    for (const it of o.items) {
      soldByFlavor.set(
        it.flavorId,
        (soldByFlavor.get(it.flavorId) ?? 0) + it.qty
      );
    }
  }
  const flavorSales = [...soldByFlavor.entries()]
    .map(([id, sold]) => ({
      id,
      name: getFlavor(id)?.name ?? id,
      accent: getFlavor(id)?.accent ?? "#8c5a3c",
      sold,
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6);

  const recentOrdersData = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    customerName: o.customerName,
    product: o.items
      .map(
        (i) =>
          `${getFlavor(i.flavorId)?.name ?? i.flavorId} (${i.sizeLabel}) ×${i.qty}`
      )
      .join(", "),
    total: o.total,
    status: o.status as "BARU" | "DIPROSES" | "SELESAI",
  }));

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/60">
            Ringkasan performa Sempe Dollar Murni
          </p>
        </div>
        <span className="rounded-full bg-cream px-4 py-2 text-sm text-ink/70">
          Halo, Admin
        </span>
      </div>

      {/* Kartu statistik */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Grafik */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-brown/15 bg-cream p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink">
            Penjualan 6 Bulan Terakhir
          </h2>
          <p className="mb-6 text-sm text-ink/50">Total pendapatan per bulan</p>
          <SalesBarChart data={monthlySales} />
        </div>

        <div className="rounded-2xl border border-brown/15 bg-cream p-6">
          <h2 className="text-lg font-semibold text-ink">Rasa Terlaris</h2>
          <p className="mb-6 text-sm text-ink/50">Jumlah terjual per rasa</p>
          <FlavorBars data={flavorSales} />
        </div>
      </div>

      {/* Pesanan terbaru */}
      <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
        <h2 className="text-lg font-semibold text-ink">Pesanan Terbaru</h2>
        <p className="mb-4 text-sm text-ink/50">Diurutkan dari yang terbaru</p>
        <RecentOrdersTable orders={recentOrdersData} />
      </div>
    </div>
  );
}
