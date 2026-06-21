import { flavors } from "./flavors";

// CATATAN: seluruh angka di bawah ini adalah data dummy untuk gambaran tampilan
// dashboard. Sambungkan dengan data asli (database/API) saat sudah tersedia.

export const stats = [
  { label: "Total Pendapatan", value: "Rp 12.450.000", delta: "+12%", up: true },
  { label: "Pesanan", value: "320", delta: "+8%", up: true },
  { label: "Produk Terjual", value: "1.240", delta: "+15%", up: true },
  { label: "Pelanggan", value: "210", delta: "+5%", up: true },
];

export const monthlySales = [
  { month: "Jul", value: 1450000 },
  { month: "Agu", value: 1720000 },
  { month: "Sep", value: 1580000 },
  { month: "Okt", value: 2010000 },
  { month: "Nov", value: 1890000 },
  { month: "Des", value: 2450000 },
];

// Jumlah terjual per rasa (dummy), mengikuti daftar rasa asli.
const soldByFlavor: Record<string, number> = {
  original: 420,
  keju: 360,
  cokelat: 310,
  pisang: 250,
  brownies: 220,
  cappuccino: 180,
  kopi: 160,
  mocha: 140,
  cocopandan: 120,
  durian: 100,
};

export const flavorSales = flavors
  .map((f) => ({
    id: f.id,
    name: f.name,
    accent: f.accent,
    sold: soldByFlavor[f.id] ?? 0,
  }))
  .sort((a, b) => b.sold - a.sold);

export type OrderStatus = "Selesai" | "Diproses" | "Baru";

export const recentOrders: {
  id: string;
  customer: string;
  item: string;
  qty: number;
  total: string;
  status: OrderStatus;
}[] = [
  {
    id: "#SDM-1042",
    customer: "Andi Saputra",
    item: "Original · 500gr",
    qty: 3,
    total: "Rp 84.000",
    status: "Selesai",
  },
  {
    id: "#SDM-1041",
    customer: "Siti Rahma",
    item: "Keju · 250gr",
    qty: 2,
    total: "Rp 30.000",
    status: "Diproses",
  },
  {
    id: "#SDM-1040",
    customer: "Budi Hartono",
    item: "Cokelat · 1kg",
    qty: 1,
    total: "Rp 50.000",
    status: "Baru",
  },
  {
    id: "#SDM-1039",
    customer: "Dewi Lestari",
    item: "Cappuccino · 500gr",
    qty: 4,
    total: "Rp 112.000",
    status: "Selesai",
  },
  {
    id: "#SDM-1038",
    customer: "Rian Pratama",
    item: "Pisang · 250gr",
    qty: 5,
    total: "Rp 75.000",
    status: "Diproses",
  },
];
