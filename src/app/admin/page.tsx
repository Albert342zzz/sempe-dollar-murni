import {
  stats,
  monthlySales,
  flavorSales,
  recentOrders,
  type OrderStatus,
} from "@/lib/adminData";
import { formatRupiah } from "@/lib/flavors";

function StatCard({
  label,
  value,
  delta,
  up,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      <p className={`mt-1 text-xs ${up ? "text-olive" : "text-terracotta"}`}>
        {delta} dari bulan lalu
      </p>
    </div>
  );
}

function SalesBarChart() {
  const max = Math.max(...monthlySales.map((m) => m.value));
  return (
    <div>
      <div className="flex h-48 items-end gap-3">
        {monthlySales.map((m) => (
          <div
            key={m.month}
            className="flex-1 rounded-t-lg bg-terracotta/80 transition hover:bg-terracotta"
            style={{ height: `${(m.value / max) * 100}%` }}
            title={formatRupiah(m.value)}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {monthlySales.map((m) => (
          <span
            key={m.month}
            className="flex-1 text-center text-xs text-ink/60"
          >
            {m.month}
          </span>
        ))}
      </div>
    </div>
  );
}

function FlavorBars() {
  const top = flavorSales.slice(0, 6);
  const max = Math.max(...top.map((f) => f.sold));
  return (
    <div className="space-y-4">
      {top.map((f) => (
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

const statusStyle: Record<OrderStatus, string> = {
  Selesai: "bg-olive/15 text-olive",
  Diproses: "bg-gold/20 text-[#8a6d0f]",
  Baru: "bg-terracotta/10 text-terracotta",
};

function OrdersTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brown/15 text-ink/50">
            <th className="pb-3 font-medium">ID</th>
            <th className="pb-3 font-medium">Pelanggan</th>
            <th className="pb-3 font-medium">Produk</th>
            <th className="pb-3 font-medium">Jumlah</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((o) => (
            <tr key={o.id} className="border-b border-brown/10 last:border-0">
              <td className="py-3 font-medium text-ink">{o.id}</td>
              <td className="py-3 text-ink/80">{o.customer}</td>
              <td className="py-3 text-ink/80">{o.item}</td>
              <td className="py-3 text-ink/80">{o.qty}</td>
              <td className="py-3 text-ink/80">{o.total}</td>
              <td className="py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[o.status]}`}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
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
          <SalesBarChart />
        </div>

        <div className="rounded-2xl border border-brown/15 bg-cream p-6">
          <h2 className="text-lg font-semibold text-ink">Rasa Terlaris</h2>
          <p className="mb-6 text-sm text-ink/50">Jumlah terjual per rasa</p>
          <FlavorBars />
        </div>
      </div>

      {/* Pesanan terbaru */}
      <div className="mt-6 rounded-2xl border border-brown/15 bg-cream p-6">
        <h2 className="text-lg font-semibold text-ink">Pesanan Terbaru</h2>
        <p className="mb-4 text-sm text-ink/50">5 pesanan terakhir</p>
        <OrdersTable />
      </div>
    </div>
  );
}
