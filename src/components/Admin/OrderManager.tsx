"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/orders/actions";
import { formatRupiah } from "@/lib/flavors";
import Pagination from "./Pagination";

type Status = "BARU" | "DIPROSES" | "SELESAI";

type Order = {
  id: number;
  customerName: string;
  phone: string;
  status: Status;
  total: number;
  createdAt: string;
  items: { flavorName: string; sizeLabel: string; qty: number }[];
};

const STATUSES: Status[] = ["BARU", "DIPROSES", "SELESAI"];
const statusLabel: Record<Status, string> = {
  BARU: "Baru",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
};
const activeStyle: Record<Status, string> = {
  BARU: "bg-terracotta text-white",
  DIPROSES: "bg-gold text-ink",
  SELESAI: "bg-olive text-white",
};

const tanggalFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function OrderRow({ order }: { order: Order }) {
  const [pending, start] = useTransition();

  function changeStatus(status: Status) {
    if (status === order.status) return;
    start(async () => {
      await updateOrderStatus(order.id, status);
    });
  }

  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">#{order.id}</span>
            <span className="text-xs text-ink/50">
              {tanggalFmt.format(new Date(order.createdAt))}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-ink/80">
            {order.customerName}{" "}
            <span className="text-ink/40">· {order.phone}</span>
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {order.items
              .map((i) => `${i.flavorName} (${i.sizeLabel}) ×${i.qty}`)
              .join(", ")}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-ink">{formatRupiah(order.total)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-brown/10 pt-3">
        <span className="text-xs text-ink/50">Status:</span>
        <div className="flex gap-1">
          {STATUSES.map((s) => {
            const isCurrent = s === order.status;
            return (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                disabled={pending || isCurrent}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  isCurrent
                    ? activeStyle[s]
                    : "border border-brown/20 text-ink/50 hover:bg-cream-soft disabled:opacity-60"
                }`}
              >
                {statusLabel[s]}
              </button>
            );
          })}
        </div>
        {pending && <span className="text-xs text-ink/40">menyimpan...</span>}
      </div>
    </div>
  );
}

export default function OrderManager({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const counts = {
    ALL: orders.length,
    BARU: orders.filter((o) => o.status === "BARU").length,
    DIPROSES: orders.filter((o) => o.status === "DIPROSES").length,
    SELESAI: orders.filter((o) => o.status === "SELESAI").length,
  };

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  const tabs: { key: "ALL" | Status; label: string }[] = [
    { key: "ALL", label: "Semua" },
    { key: "BARU", label: "Baru" },
    { key: "DIPROSES", label: "Diproses" },
    { key: "SELESAI", label: "Selesai" },
  ];

  function changeFilter(key: "ALL" | Status) {
    setFilter(key);
    setPage(1);
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => changeFilter(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              filter === t.key
                ? "bg-ink text-cream"
                : "border border-brown/20 text-ink/70 hover:bg-cream-soft"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
          Tidak ada pesanan pada kategori ini.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {pageItems.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
          <Pagination
            page={current}
            pageCount={pageCount}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
