"use client";

import { useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { flavors, sizes, getPrice, formatRupiah } from "@/lib/flavors";
import { waLink } from "@/lib/contact";
import { useCart } from "@/context/CartContext";

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const flavor = flavors[active];

  function handleAdd() {
    addItem(flavor.id, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      {/* Tampilan rasa terpilih */}
      <div
        className="grid items-center gap-8 rounded-3xl border border-brown/15 p-6 transition-colors duration-500 md:grid-cols-2 md:p-10"
        style={{ backgroundColor: `${flavor.accent}14` }}
      >
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <Image
            src={flavor.image}
            alt={`Sempe rasa ${flavor.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: flavor.accent }}
            />
            <span className="text-xs font-medium uppercase tracking-widest text-brown">
              Varian Rasa
            </span>
          </div>

          <h3 className="mt-3 text-3xl font-semibold md:text-4xl">
            {flavor.name}
          </h3>

          <p className="mt-4 leading-relaxed text-gray-600">
            {flavor.description}
          </p>

          <p className="mt-4 text-2xl font-semibold text-ink">
            {formatRupiah(getPrice(size))}
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
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
                      isActive
                        ? "border-terracotta bg-terracotta text-white"
                        : "border-brown/20 text-ink/70 hover:border-brown/40"
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
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-cream transition hover:bg-brown"
            >
              <FiShoppingBag className="text-base" />
              Tambah ke Keranjang
            </button>

            <a
              href={waLink(
                `Halo Sempe Dollar Murni, saya ingin memesan Sempe rasa ${flavor.name} ukuran ${size}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
            >
              <FaWhatsapp className="text-base" />
              Pesan rasa ini
            </a>

            {added && (
              <span className="text-sm font-medium text-olive">
                ✓ Ditambahkan ke keranjang
              </span>
            )}
          </div>
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
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "font-medium shadow-sm"
                    : "border-brown/20 text-ink/70 hover:border-brown/40"
                }`}
                style={
                  isActive
                    ? {
                        borderColor: f.accent,
                        backgroundColor: `${f.accent}14`,
                      }
                    : undefined
                }
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
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
