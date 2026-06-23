"use client";

import { useActionState } from "react";
import { updatePrices, type ActionState } from "@/app/admin/products/actions";

type Size = { id: number; label: string; price: number };

const initial: ActionState = { ok: false };

export default function PriceManager({ sizes }: { sizes: Size[] }) {
  const [state, action, pending] = useActionState(updatePrices, initial);

  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-6">
      <h2 className="text-lg font-semibold text-ink">Harga Ukuran</h2>
      <p className="mb-5 text-sm text-ink/50">
        Harga ini dipakai di halaman produk & saat checkout.
      </p>

      <form action={action} className="flex flex-wrap items-end gap-4">
        {sizes.map((s) => (
          <div key={s.id}>
            <label
              htmlFor={`price_${s.id}`}
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              {s.label}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/50">Rp</span>
              <input
                id={`price_${s.id}`}
                name={`price_${s.id}`}
                type="number"
                min={0}
                step={500}
                defaultValue={s.price}
                className="w-32 rounded-xl border border-brown/20 px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan Harga"}
        </button>

        {state.ok && (
          <span className="text-sm font-medium text-olive">✓ Tersimpan</span>
        )}
        {state.error && (
          <span className="text-sm text-terracotta">{state.error}</span>
        )}
      </form>
    </div>
  );
}
