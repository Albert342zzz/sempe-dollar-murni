"use client";

import { useActionState } from "react";
import {
  updateFlavorPrices,
  type ActionState,
} from "@/app/admin/products/actions";
import Spinner from "@/components/Spinner";

type Size = { id: number; label: string };
type Flavor = { id: string; name: string };
// flavorId -> sizeId -> price
type Matrix = Record<string, Record<number, number>>;

const initial: ActionState = { ok: false };

export default function PriceMatrix({
  flavors,
  sizes,
  matrix,
}: {
  flavors: Flavor[];
  sizes: Size[];
  matrix: Matrix;
}) {
  const [state, action, pending] = useActionState(updateFlavorPrices, initial);

  return (
    <div className="mb-8 rounded-2xl border border-brown/15 bg-cream p-6">
      <h2 className="text-lg font-semibold text-ink">Harga per Rasa</h2>
      <p className="mb-5 text-sm text-ink/50">
        Atur harga tiap rasa untuk masing-masing ukuran. Harga ini dipakai di
        halaman produk & saat checkout.
      </p>

      <form action={action}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-brown/10 text-left text-xs font-medium uppercase tracking-wider text-ink/40">
                <th className="py-2 pr-4">Rasa</th>
                {sizes.map((s) => (
                  <th key={s.id} className="px-3 py-2">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/10">
              {flavors.map((f) => (
                <tr key={f.id}>
                  <td className="py-2 pr-4 font-medium text-ink">{f.name}</td>
                  {sizes.map((s) => (
                    <td key={s.id} className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-ink/40">Rp</span>
                        <input
                          name={`price_${f.id}_${s.id}`}
                          type="number"
                          min={0}
                          step={500}
                          defaultValue={matrix[f.id]?.[s.id] ?? 0}
                          className="w-28 rounded-lg border border-brown/20 px-2 py-1.5 text-sm text-ink outline-none transition focus:border-terracotta"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-2.5 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && <Spinner className="h-4 w-4" />}
            {pending ? "Menyimpan..." : "Simpan Harga"}
          </button>

          {state.ok && (
            <span className="text-sm font-medium text-olive">✓ Tersimpan</span>
          )}
          {state.error && (
            <span className="text-sm text-terracotta">{state.error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
