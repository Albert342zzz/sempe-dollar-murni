import type { Metadata } from "next";
import CartView from "@/components/Cart/CartView";
import { eloquia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Keranjang Saya - Sempe Dollar Murni",
  description:
    "Atur pesanan Sempe favoritmu — pilih rasa, ukuran, dan jumlah, lalu kirim ke WhatsApp kami.",
};

export default function CartPage() {
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
          <CartView />
        </div>
      </section>
    </main>
  );
}
