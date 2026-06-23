"use client";

type Props = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onPageSize: (s: number) => void;
};

const SIZES = [5, 10];

export default function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPage,
  onPageSize,
}: Props) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-ink/60">
        <span>Tampilkan</span>
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onPageSize(s)}
            className={`rounded-lg px-2.5 py-1 transition ${
              pageSize === s
                ? "bg-ink text-cream"
                : "border border-brown/20 hover:bg-cream-soft"
            }`}
          >
            {s}
          </button>
        ))}
        <span className="ml-1 text-ink/50">
          · {from}–{to} dari {total}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-brown/20 px-3 py-1 transition hover:bg-cream-soft disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <span className="text-ink/60">
          Hal {page}/{pageCount}
        </span>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          className="rounded-lg border border-brown/20 px-3 py-1 transition hover:bg-cream-soft disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
