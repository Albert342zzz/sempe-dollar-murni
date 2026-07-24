"use client";

import { useMemo, useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { formatRupiah, sizes as SIZE_ORDER } from "@/lib/flavors";

export type ProductRow = {
  flavor: string;
  size: string;
  qty: number;
  amount: number;
};

type GroupBy = "product" | "flavor" | "size";
type SortKey = "flavor" | "size" | "qty" | "amount";
type Direction = "asc" | "desc";

const GROUPS: { key: GroupBy; label: string }[] = [
  { key: "product", label: "Rasa × Berat" },
  { key: "flavor", label: "Per Rasa" },
  { key: "size", label: "Per Berat" },
];

// Canonical weight order (150gr → 3kg) so sorting by size is meaningful
// rather than alphabetical. Unknown sizes sort last.
const sizeRank = (size: string) => {
  const i = SIZE_ORDER.indexOf(size);
  return i === -1 ? SIZE_ORDER.length : i;
};

function collapse(rows: ProductRow[], by: "flavor" | "size"): ProductRow[] {
  const map = new Map<string, ProductRow>();
  for (const r of rows) {
    const key = r[by];
    const item = map.get(key) ?? {
      flavor: by === "flavor" ? r.flavor : "",
      size: by === "size" ? r.size : "",
      qty: 0,
      amount: 0,
    };
    item.qty += r.qty;
    item.amount += r.amount;
    map.set(key, item);
  }
  return [...map.values()];
}

function SortHeader({
  label,
  active,
  direction,
  align = "left",
  onClick,
}: {
  label: string;
  active: boolean;
  direction: Direction;
  align?: "left" | "right";
  onClick: () => void;
}) {
  return (
    <th className={`px-3 py-2 font-medium ${align === "right" ? "text-right" : ""}`}>
      <button
        onClick={onClick}
        className={`inline-flex cursor-pointer items-center gap-1 transition hover:text-terracotta ${
          active ? "text-terracotta" : ""
        }`}
      >
        {label}
        {active &&
          (direction === "desc" ? (
            <FiArrowDown className="text-[11px]" />
          ) : (
            <FiArrowUp className="text-[11px]" />
          ))}
      </button>
    </th>
  );
}

export default function ProductBreakdownTable({ rows }: { rows: ProductRow[] }) {
  const [group, setGroup] = useState<GroupBy>("product");
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [direction, setDirection] = useState<Direction>("desc");

  const showFlavor = group !== "size";
  const showSize = group !== "flavor";

  const data = useMemo(() => {
    const base =
      group === "product" ? [...rows] : collapse(rows, group as "flavor" | "size");

    const dir = direction === "asc" ? 1 : -1;
    return base.sort((a, b) => {
      switch (sortKey) {
        case "flavor":
          return a.flavor.localeCompare(b.flavor, "id") * dir;
        case "size":
          return (sizeRank(a.size) - sizeRank(b.size)) * dir;
        case "qty":
          return (a.qty - b.qty) * dir;
        default:
          return (a.amount - b.amount) * dir;
      }
    });
  }, [rows, group, sortKey, direction]);

  const totalAmount = useMemo(
    () => rows.reduce((s, r) => s + r.amount, 0),
    [rows]
  );
  const totalQty = useMemo(() => rows.reduce((s, r) => s + r.qty, 0), [rows]);

  // Clicking the active column flips direction; a new column starts at the
  // most useful default (Z→A for numbers, A→Z for text).
  function sortBy(key: SortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setDirection(key === "qty" || key === "amount" ? "desc" : "asc");
  }

  // Keep the sort valid when a column disappears after switching groups.
  function changeGroup(next: GroupBy) {
    setGroup(next);
    if (next === "flavor" && sortKey === "size") sortBy("amount");
    if (next === "size" && sortKey === "flavor") sortBy("amount");
  }

  return (
    <div>
      {/* Grouping control */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-ink/40">
          Kelompokkan
        </span>
        {GROUPS.map((g) => (
          <button
            key={g.key}
            onClick={() => changeGroup(g.key)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ${
              group === g.key
                ? "border-terracotta bg-terracotta text-white"
                : "border-brown/20 text-ink/70 hover:border-terracotta/50 hover:text-terracotta"
            }`}
          >
            {g.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink/40">
          {data.length} baris · klik judul kolom untuk mengurutkan
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brown/10 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              {showFlavor && (
                <SortHeader
                  label="Rasa"
                  active={sortKey === "flavor"}
                  direction={direction}
                  onClick={() => sortBy("flavor")}
                />
              )}
              {showSize && (
                <SortHeader
                  label="Berat"
                  active={sortKey === "size"}
                  direction={direction}
                  onClick={() => sortBy("size")}
                />
              )}
              <SortHeader
                label="Jumlah"
                align="right"
                active={sortKey === "qty"}
                direction={direction}
                onClick={() => sortBy("qty")}
              />
              <SortHeader
                label="Total"
                align="right"
                active={sortKey === "amount"}
                direction={direction}
                onClick={() => sortBy("amount")}
              />
              <th className="px-3 py-2 text-right font-medium">Kontribusi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => {
              const share = totalAmount > 0 ? (p.amount / totalAmount) * 100 : 0;
              return (
                <tr
                  key={`${p.flavor}-${p.size}`}
                  className="border-b border-brown/5 last:border-0 hover:bg-cream-soft"
                >
                  {showFlavor && (
                    <td className="px-3 py-2 text-ink/80">{p.flavor}</td>
                  )}
                  {showSize && (
                    <td className="px-3 py-2 text-ink/60">{p.size}</td>
                  )}
                  <td className="px-3 py-2 text-right text-ink/70">{p.qty}</td>
                  <td className="px-3 py-2 text-right font-medium text-ink">
                    {formatRupiah(p.amount)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-brown/10 sm:block">
                        <span
                          className="block h-full rounded-full bg-terracotta/70"
                          style={{ width: `${share}%` }}
                        />
                      </span>
                      <span className="w-11 text-right text-xs tabular-nums text-ink/50">
                        {share.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-brown/15 text-sm">
            <tr>
              <td
                className="px-3 py-2 font-medium text-ink/60"
                colSpan={(showFlavor ? 1 : 0) + (showSize ? 1 : 0)}
              >
                Total
              </td>
              <td className="px-3 py-2 text-right font-medium text-ink">
                {totalQty}
              </td>
              <td className="px-3 py-2 text-right font-semibold text-ink">
                {formatRupiah(totalAmount)}
              </td>
              <td className="px-3 py-2 text-right text-xs text-ink/40">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
