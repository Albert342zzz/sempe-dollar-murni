"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiCheckCircle,
} from "react-icons/fi";
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

const inputClass =
  "w-full rounded-xl border border-brown/20 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/15";

type CreatedOrder = {
  id: number;
  customerName: string;
  total: number;
  items: { flavorId: string; sizeLabel: string; qty: number; price: number }[];
};

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

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<CreatedOrder | null>(null);

  async function handleCheckout() {
    setError(null);

    if (!customerName.trim() || !phone.trim()) {
      setError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          items: items.map((it) => ({
            flavorId: it.flavorId,
            sizeLabel: it.size,
            qty: it.qty,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal membuat pesanan.");
      }

      const order: CreatedOrder = await res.json();
      setSuccessOrder(order);
      clearCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  // Tampilan setelah pesanan berhasil dibuat.
  if (successOrder) {
    const waMessage = `Halo Sempe Dollar Murni, saya sudah membuat pesanan #${
      successOrder.id
    }:\n\n${successOrder.items
      .map(
        (it, i) =>
          `${i + 1}. Sempe ${getFlavor(it.flavorId)?.name ?? it.flavorId} (${
            it.sizeLabel
          }) x${it.qty}`
      )
      .join("\n")}\n\nTotal: ${formatRupiah(successOrder.total)}\nNama: ${
      successOrder.customerName
    }\n\nMohon konfirmasi ketersediaan & pembayaran.`;

    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-brown/15 bg-cream p-10 text-center">
        <FiCheckCircle className="mx-auto text-5xl text-olive" />
        <h2 className="mt-4 text-2xl font-semibold text-ink">
          Pesanan Berhasil Dibuat!
        </h2>
        <p className="mt-2 text-ink/60">
          Nomor pesanan kamu:{" "}
          <span className="font-semibold text-ink">#{successOrder.id}</span>
        </p>
        <p className="mt-1 text-ink/60">
          Total:{" "}
          <span className="font-semibold text-ink">
            {formatRupiah(successOrder.total)}
          </span>
        </p>
        <p className="mt-4 text-sm text-ink/50">
          Kirim detail pesanan ke WhatsApp kami untuk konfirmasi pembayaran &
          pengiriman.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
          >
            <FaWhatsapp className="text-base" />
            Kirim ke WhatsApp
          </a>
          <Link
            href="/product"
            className="inline-block rounded-full border border-brown/30 px-6 py-3 text-sm text-ink transition hover:bg-cream-soft"
          >
            Belanja Lagi
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Ringkasan & checkout */}
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

        {/* Data pemesan */}
        <div className="mt-6 space-y-3 border-t border-brown/10 pt-6">
          <div>
            <label htmlFor="nama" className="mb-1.5 block text-sm font-medium">
              Nama
            </label>
            <input
              id="nama"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama lengkap"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="telp" className="mb-1.5 block text-sm font-medium">
              No. WhatsApp
            </label>
            <input
              id="telp"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={inputClass}
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Memproses..." : "Buat Pesanan"}
        </button>

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
