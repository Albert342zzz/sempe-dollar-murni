import { prisma } from "@/lib/prisma";

// Read fresh data on each request; never prerender at build time.
export const dynamic = "force-dynamic";

// How far back the insights look. Bounds the query as event volume grows.
const WINDOW_DAYS = 90;

// Friendly labels for each WhatsApp click source.
const SOURCE_LABELS: Record<string, string> = {
  product: "Produk (per rasa)",
  product_cta: "Produk (tombol bawah)",
  cart: "Keranjang",
  home: "Beranda",
  contact_form: "Form Kontak",
  footer: "Footer",
};

// Safely read a string field from a JSON meta value.
function metaStr(meta: unknown, key: string): string | undefined {
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    const v = (meta as Record<string, unknown>)[key];
    if (typeof v === "string") return v;
  }
  return undefined;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink/50">{sub}</p>
    </div>
  );
}

function BarList({
  data,
  unit,
}: {
  data: { label: string; value: number }[];
  unit?: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-ink/50">Belum ada data.</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink/80">{d.label}</span>
            <span className="text-ink/50">
              {d.value}
              {unit ? ` ${unit}` : ""}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-cream-soft">
            <div
              className="h-2 rounded-full bg-terracotta"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex h-40 items-end gap-1.5">
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="flex-1 rounded-t-md bg-terracotta/80 transition hover:bg-terracotta"
            style={{ height: `${Math.max((d.value / max) * 100, 3)}%` }}
            title={`${d.label}: ${d.value} klik`}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`} className="flex-1 text-center text-[10px] text-ink/40">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function InsightsPage() {
  const nowMs = new Date().getTime();
  const since = new Date(nowMs - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const events = await prisma.siteEvent.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });

  const waClicks = events.filter((e) => e.type === "wa_click");
  const productViews = events.filter((e) => e.type === "product_view");

  const within = (days: number, at: Date) =>
    nowMs - at.getTime() <= days * 24 * 60 * 60 * 1000;
  const wa7 = waClicks.filter((e) => within(7, e.createdAt)).length;
  const wa30 = waClicks.filter((e) => within(30, e.createdAt)).length;

  // WhatsApp clicks grouped by source.
  const bySource = new Map<string, number>();
  for (const e of waClicks) {
    const key = metaStr(e.meta, "source") ?? "lainnya";
    bySource.set(key, (bySource.get(key) ?? 0) + 1);
  }
  const waSourceRows = [...bySource.entries()]
    .map(([key, value]) => ({ label: SOURCE_LABELS[key] ?? key, value }))
    .sort((a, b) => b.value - a.value);

  // Product views grouped by flavor (popular products).
  const byFlavor = new Map<string, number>();
  for (const e of productViews) {
    const name = metaStr(e.meta, "flavorName") ?? "Tidak diketahui";
    byFlavor.set(name, (byFlavor.get(name) ?? 0) + 1);
  }
  const popularRows = [...byFlavor.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Daily WhatsApp click trend for the last 14 days.
  const trend: { label: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - i);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    const value = waClicks.filter(
      (e) => e.createdAt >= start && e.createdAt < end
    ).length;
    trend.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, value });
  }

  const topFlavor = popularRows[0]?.label ?? "—";

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Insight Web</h1>
        <p className="text-sm text-ink/60">
          Interaksi pengunjung situs dalam {WINDOW_DAYS} hari terakhir — klik
          WhatsApp & produk yang paling dilihat.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brown/25 bg-cream p-12 text-center">
          <h2 className="text-lg font-semibold text-ink">Belum ada data</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            Data akan muncul di sini saat pengunjung mulai membuka halaman
            produk dan menekan tombol pesan via WhatsApp.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Klik WhatsApp"
              value={String(waClicks.length)}
              sub={`${WINDOW_DAYS} hari terakhir`}
            />
            <StatCard label="Klik WA (7 hari)" value={String(wa7)} sub="minggu ini" />
            <StatCard label="Klik WA (30 hari)" value={String(wa30)} sub="bulan ini" />
            <StatCard
              label="Rasa Paling Dilihat"
              value={topFlavor}
              sub={`${productViews.length} kali lihat produk`}
            />
          </div>

          {/* Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-brown/15 bg-cream p-6">
              <h2 className="text-lg font-semibold text-ink">Klik WhatsApp per Sumber</h2>
              <p className="mb-5 text-sm text-ink/50">
                Dari halaman/tombol mana pengunjung menghubungi WhatsApp
              </p>
              <BarList data={waSourceRows} unit="klik" />
            </div>

            <div className="rounded-2xl border border-brown/15 bg-cream p-6">
              <h2 className="text-lg font-semibold text-ink">Produk Terpopuler</h2>
              <p className="mb-5 text-sm text-ink/50">Rasa yang paling sering dilihat</p>
              <BarList data={popularRows} unit="lihat" />
            </div>
          </div>

          {/* Trend */}
          <div className="rounded-2xl border border-brown/15 bg-cream p-6">
            <h2 className="text-lg font-semibold text-ink">Tren Klik WhatsApp</h2>
            <p className="mb-5 text-sm text-ink/50">14 hari terakhir</p>
            <TrendBars data={trend} />
          </div>
        </div>
      )}
    </div>
  );
}
