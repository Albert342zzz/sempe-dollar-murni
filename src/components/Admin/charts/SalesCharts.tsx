"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const TERRACOTTA = "#b8623d";
const OLIVE = "#7c8a4e";

const rupiahShort = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}rb`;
  return String(v);
};

const rupiahFull = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(v);

const axis = { fontSize: 12, fill: "#6b5b4d" };

// Horizontal bar chart for per-category breakdown (flavor / size / product).
export function BreakdownChart({
  data,
}: {
  data: { label: string; amount: number; qty: number }[];
}) {
  if (data.length === 0) {
    return <p className="text-sm text-ink/50">Belum ada data penjualan.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 40, 120)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e7ddd0" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={rupiahShort}
          tick={axis}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={axis}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          formatter={(v) => [rupiahFull(Number(v)), "Penjualan"]}
          contentStyle={{ borderRadius: 12, border: "1px solid #e7ddd0" }}
          cursor={{ fill: "#f3ece2" }}
        />
        <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i % 2 === 0 ? TERRACOTTA : OLIVE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
