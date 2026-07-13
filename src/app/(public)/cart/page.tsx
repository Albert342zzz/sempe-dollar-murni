import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdminUser } from "@/lib/supabase/user";
import CartView from "@/components/Cart/CartView";
import { eloquia } from "@/lib/fonts";
import { prisma } from "@/lib/prisma";
import type { PriceMap } from "@/lib/prices";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Keranjang Saya",
  description:
    "Atur pesanan Sempe favoritmu — pilih rasa, ukuran, dan jumlah, lalu kirim ke WhatsApp kami.",
};

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cart");

  // Admins have no cart — send them to the admin panel.
  if (await isAdminUser(user.id)) redirect("/admin");

  const flavorPrices = await prisma.flavorPrice.findMany({
    include: { size: true },
  });
  const prices: PriceMap = {};
  for (const fp of flavorPrices) {
    (prices[fp.flavorId] ??= {})[fp.size.label] = fp.price;
  }

  return (
    <main>
      <section className="bg-cream pt-16 pb-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm tracking-widest text-brown">
            SEMPE DOLLAR MURNI
          </p>
          <h1
            className={`${eloquia.className} mt-3 text-4xl font-semibold md:text-5xl`}
          >
            Keranjang Saya
          </h1>
          <p className="mt-3 text-ink/60">
            Atur pesanan Sempe favoritmu sebelum dikirim ke WhatsApp kami.
          </p>
        </div>
      </section>

      <section className="bg-cream-soft py-12">
        <div className="mx-auto max-w-5xl px-6">
          <CartView prices={prices} />
        </div>
      </section>
    </main>
  );
}
