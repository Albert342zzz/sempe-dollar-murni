"use client";

import { useState } from "react";
import Pagination from "./Pagination";
import { formatRupiah } from "@/lib/flavors";

type Status = "BARU" | "DIPROSES" | "SELESAI";

type Row = {
  id: number;
  createdAt: string;
  customerName: string;
  product: string;
  total: number;
  status: Status;
};

const statusLabel: Record<Status, string> = {
  BARU: "Baru",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
};

const statusStyle: Record<Status, string> = {
  BARU: "bg-terracotta/10 text-terracotta",
  DIPROSES: "bg-gold/20 text-[#8a6d0f]",
  SELESAI: "bg-olive/15 text-olive",
};

const tanggalFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function RecentOrdersTable({ orders }: { orders: Row[] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  if (orders.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-ink/50">
        Pesanan yang masuk lewat checkout akan muncul di sini.
      </p>
    );
  }

  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
  const current = Math.min(page, pageCount);
  const rows = orders.slice((current - 1) * pageSize, current * pageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-brown/15 text-ink/50">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Pelanggan</th>
              <th className="pb-3 font-medium">Produk</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-brown/10 last:border-0">
                <td className="py-3 font-medium text-ink">#{o.id}</td>
                <td className="py-3 text-ink/70">
                  {tanggalFmt.format(new Date(o.createdAt))}
                </td>
                <td className="py-3 text-ink/80">{o.customerName}</td>
                <td className="py-3 text-ink/80">{o.product}</td>
                <td className="py-3 text-ink/80">{formatRupiah(o.total)}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[o.status]}`}
                  >
                    {statusLabel[o.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={current}
        pageCount={pageCount}
        pageSize={pageSize}
        total={orders.length}
        onPage={setPage}
        onPageSize={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </>
  );
}
