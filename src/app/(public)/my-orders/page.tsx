import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/user";
import { prisma } from "@/lib/prisma";
import { getFlavor, formatRupiah } from "@/lib/flavors";
import { eloquia } from "@/lib/fonts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pesanan Saya - Sempe Dollar Murni",
};

const statusLabel: Record<string, string> = {
  BARU: "Baru",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
};
const statusStyle: Record<string, string> = {
  BARU: "bg-terracotta/10 text-terracotta",
  DIPROSES: "bg-gold/20 text-[#8a6d0f]",
  SELESAI: "bg-olive/15 text-olive",
};
const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function MyOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/my-orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-cream-soft">
      <section className="mx-auto min-h-[calc(100vh-80px)] max-w-3xl px-6 py-12">
        <h1 className={`${eloquia.className} text-3xl font-semibold md:text-4xl`}>
          Pesanan Saya
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Riwayat pesanan untuk akun {user.email}.
        </p>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-brown/15 bg-cream p-12 text-center">
            <p className="text-ink/60">Kamu belum punya pesanan.</p>
            <Link
              href="/product"
              className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
            >
              Mulai Pesan
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-brown/15 bg-cream p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">#{o.id}</span>
                    <span className="text-xs text-ink/50">
                      {dateFmt.format(o.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[o.status]}`}
                  >
                    {statusLabel[o.status] ?? o.status}
                  </span>
                </div>

                <ul className="mt-3 space-y-1 text-sm text-ink/70">
                  {o.items.map((it) => (
                    <li key={it.id}>
                      {getFlavor(it.flavorId)?.name ?? it.flavorId} ({it.sizeLabel}){" "}
                      × {it.qty}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-brown/10 pt-3">
                  <span className="text-sm text-ink/60">Total</span>
                  <span className="font-semibold text-ink">
                    {formatRupiah(o.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
