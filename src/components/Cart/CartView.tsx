"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import {
  flavors,
  sizes,
  getFlavor,
  getPrice,
  formatRupiah,
} from "@/lib/flavors";
import { waLink } from "@/lib/contact";

const selectClass =
  "rounded-full border border-brown/20 bg-cream px-3 py-1.5 text-sm text-ink outline-none transition focus:border-terracotta";

function AddOrderRow({
  onAdd,
}: {
  onAdd: (flavorId: string, size: string, qty?: number) => void;
}) {
  const [flavorId, setFlavorId] = useState(flavors[0].id);
  const [size, setSize] = useState(sizes[0]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-dashed border-brown/30 bg-cream-soft p-4">
      <span className="text-sm font-medium text-ink">Tambah pesanan:</span>

      <select
        value={flavorId}
        onChange={(e) => setFlavorId(e.target.value)}
        className={selectClass}
        aria-label="Pilih rasa"
      >
        {flavors.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className={selectClass}
        aria-label="Pilih ukuran"
      >
        {sizes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={() => onAdd(flavorId, size, 1)}
        className="ml-auto inline-flex items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-sm text-cream transition hover:bg-brown"
      >
        <FiPlus /> Tambah
      </button>
    </div>
  );
}

export default function CartView() {
  const {
    items,
    totalCount,
    increment,
    decrement,
    removeItem,
    updateLine,
    addItem,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-brown/15 bg-cream p-12 text-center">
        <FiShoppingBag className="mx-auto text-4xl text-brown/50" />
        <h2 className="mt-4 text-xl font-semibold text-ink">
          Keranjang masih kosong
        </h2>
        <p className="mt-2 text-ink/60">
          Yuk, pilih rasa Sempe favoritmu terlebih dahulu.
        </p>
        <Link
          href="/product"
          className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  const grandTotal = items.reduce(
    (sum, it) => sum + getPrice(it.size) * it.qty,
    0
  );

  const orderMessage = `Halo Sempe Dollar Murni, saya ingin memesan:\n\n${items
    .map((it, idx) => {
      const f = getFlavor(it.flavorId);
      return `${idx + 1}. Sempe ${f?.name ?? it.flavorId} (${it.size}) x${
        it.qty
      } - ${formatRupiah(getPrice(it.size) * it.qty)}`;
    })
    .join(
      "\n"
    )}\n\nTotal: ${totalCount} item\nTotal harga: ${formatRupiah(grandTotal)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Daftar pesanan */}
      <div className="space-y-4 lg:col-span-2">
        {items.map((it) => {
          const flavor = getFlavor(it.flavorId);
          return (
            <div
              key={`${it.flavorId}__${it.size}`}
              className="flex gap-4 rounded-3xl border border-brown/15 bg-cream p-4"
            >
              <div
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl"
                style={{ backgroundColor: `${flavor?.accent ?? "#3d2c1e"}14` }}
              >
                {flavor && (
                  <Image
                    src={flavor.image}
                    alt={`Sempe ${flavor.name}`}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-brown">
                      Sempe
                    </p>
                    <h3 className="text-lg font-semibold text-ink">
                      {flavor?.name ?? it.flavorId}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-terracotta">
                      {formatRupiah(getPrice(it.size))}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(it.flavorId, it.size)}
                    aria-label="Hapus pesanan"
                    className="text-ink/40 transition hover:text-terracotta"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={it.flavorId}
                    onChange={(e) =>
                      updateLine(
                        { flavorId: it.flavorId, size: it.size },
                        { flavorId: e.target.value, size: it.size }
                      )
                    }
                    className={selectClass}
                    aria-label="Ubah rasa"
                  >
                    {flavors.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={it.size}
                    onChange={(e) =>
                      updateLine(
                        { flavorId: it.flavorId, size: it.size },
                        { flavorId: it.flavorId, size: e.target.value }
                      )
                    }
                    className={selectClass}
                    aria-label="Ubah ukuran"
                  >
                    {sizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <div className="ml-auto inline-flex items-center rounded-full border border-brown/20">
                    <button
                      onClick={() => decrement(it.flavorId, it.size)}
                      aria-label="Kurangi jumlah"
                      className="px-3 py-1.5 text-ink transition hover:text-terracotta"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => increment(it.flavorId, it.size)}
                      aria-label="Tambah jumlah"
                      className="px-3 py-1.5 text-ink transition hover:text-terracotta"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-brown/10 pt-3 text-sm">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="font-semibold text-ink">
                    {formatRupiah(getPrice(it.size) * it.qty)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <AddOrderRow onAdd={addItem} />
      </div>

      {/* Ringkasan */}
      <aside className="h-fit rounded-3xl border border-brown/15 bg-cream p-6">
        <h2 className="text-lg font-semibold text-ink">Ringkasan Pesanan</h2>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink/60">Total item</span>
          <span className="font-medium text-ink">{totalCount}</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-brown/10 pt-3">
          <span className="text-ink/70">Total harga</span>
          <span className="text-lg font-semibold text-ink">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink/50">
          Harga belum termasuk ongkos kirim. Konfirmasi akhir dilakukan melalui
          WhatsApp sesuai ketersediaan stok.
        </p>

        <a
          href={waLink(orderMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
        >
          <FaWhatsapp className="text-base" />
          Pesan via WhatsApp
        </a>

        <button
          onClick={clearCart}
          className="mt-3 w-full rounded-full border border-brown/20 px-6 py-3 text-sm text-ink/70 transition hover:bg-cream-soft"
        >
          Kosongkan Keranjang
        </button>
      </aside>
    </div>
  );
}
