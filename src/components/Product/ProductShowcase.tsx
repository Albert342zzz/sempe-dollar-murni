"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";
import { flavors, sizes, formatRupiah } from "@/lib/flavors";
import { priceFor, type PriceMap } from "@/lib/prices";
import { waLink } from "@/lib/contact";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

export default function ProductShowcase({ prices }: { prices: PriceMap }) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { addItem } = useCart();
  const flavor = flavors[active];
  const price = priceFor(prices, flavor.id, size);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Cart is a logged-in feature (allows selecting multiple flavors).
  function handleAdd() {
    if (!isLoggedIn) {
      router.push("/login?next=/product");
      return;
    }
    addItem(flavor.id, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waMessage = `Halo Sempe Dollar Murni, saya ingin memesan Sempe rasa ${flavor.name} ukuran ${size} (${formatRupiah(price)}).`;

  const total = flavors.length;
  const go = (dir: number) => setActive((i) => (i + dir + total) % total);

  return (
    <div>
      {/* Selected flavor showcase */}
      <div
        className="relative grid items-center gap-8 overflow-hidden rounded-3xl border border-brown/15 p-6 transition-colors duration-700 md:grid-cols-2 md:p-10"
        style={{ backgroundColor: `${flavor.accent}14` }}
      >
        {/* Corner accent blob that follows the flavor color */}
        <span
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: flavor.accent }}
        />

        {/* Product image with halo glow and rotating ring */}
        <div className="relative mx-auto aspect-square w-full">
          <span
            className="absolute inset-10 rounded-full opacity-40 blur-2xl transition-colors duration-700"
            style={{ backgroundColor: flavor.accent }}
          />
          <span
            className="absolute inset-2 animate-spin rounded-full border border-dashed opacity-25 [animation-duration:24s]"
            style={{ borderColor: flavor.accent }}
          />
          <div key={flavor.id} className="absolute inset-0 animate-fade-in-up">
            <Image
              src={flavor.image}
              alt={`Sempe rasa ${flavor.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div key={flavor.id} className="animate-fade-in-up">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: flavor.accent }}
              />
              <span className="text-xs font-medium uppercase tracking-widest text-brown">
                Varian Rasa
              </span>
            </div>

            {/* Prev / next navigation */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => go(-1)}
                aria-label="Rasa sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-brown/20 text-ink/60 transition hover:border-terracotta hover:bg-cream hover:text-terracotta"
              >
                <FiChevronLeft />
              </button>
              <span className="min-w-10 text-center text-xs tabular-nums text-ink/50">
                {active + 1} / {total}
              </span>
              <button
                onClick={() => go(1)}
                aria-label="Rasa berikutnya"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-brown/20 text-ink/60 transition hover:border-terracotta hover:bg-cream hover:text-terracotta"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          <h3 className="mt-3 text-3xl font-semibold md:text-4xl">
            {flavor.name}
          </h3>

          <p className="mt-4 leading-relaxed text-gray-600">
            {flavor.description}
          </p>

          <p className="mt-4 text-2xl font-semibold text-ink">
            {formatRupiah(price)}
          </p>

          <div className="mt-5">
            <p className="text-sm text-brown">Ukuran</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => {
                const isActive = s === size;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "border-terracotta bg-terracotta text-white shadow-sm"
                        : "border-brown/20 text-ink/70 hover:-translate-y-0.5 hover:border-brown/40"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-brown"
            >
              <FiShoppingBag className="text-base" />
              Tambah ke Keranjang
            </button>

            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm text-white shadow-lg shadow-terracotta/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brown"
            >
              <FaWhatsapp className="text-base" />
              Pesan via WhatsApp
            </a>

            {added && (
              <span className="inline-flex animate-fade-in-up items-center gap-1.5 rounded-full bg-olive/10 px-3 py-1.5 text-sm font-medium text-olive">
                <FiCheck /> Ditambahkan ke keranjang
              </span>
            )}
          </div>

          {isLoggedIn === false && (
            <p className="mt-3 text-sm text-ink/50">
              Bisa langsung pesan via WhatsApp tanpa login. Mau pilih banyak
              rasa sekaligus?{" "}
              <Link
                href="/login?next=/product"
                className="text-terracotta hover:underline"
              >
                Login dulu
              </Link>{" "}
              untuk pakai keranjang.
            </p>
          )}
        </div>
      </div>

      {/* Pemilih rasa */}
      <div className="mt-8">
        <p className="mb-4 text-center text-sm text-gray-500">
          Pilih rasa untuk melihat detailnya
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {flavors.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.id}
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`group flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "scale-105 font-semibold shadow-md"
                    : "border-brown/20 text-ink/70 hover:-translate-y-0.5 hover:border-brown/40 hover:shadow-sm"
                }`}
                style={
                  isActive
                    ? {
                        borderColor: f.accent,
                        backgroundColor: `${f.accent}1f`,
                      }
                    : undefined
                }
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200 ${
                    isActive ? "scale-125" : "group-hover:scale-110"
                  }`}
                  style={{ backgroundColor: f.accent }}
                />
                {f.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
