"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  createFlavor,
  updateFlavor,
  deleteFlavor,
} from "@/app/admin/products/actions";

type Flavor = {
  id: string;
  name: string;
  description: string;
  accent: string;
  image: string;
};

const inputClass =
  "w-full rounded-xl border border-brown/20 px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta";
const labelClass = "mb-1 block text-xs font-medium text-ink/70";

function AddFlavorForm({ onDone }: { onDone: () => void }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const res = await createFlavor({ ok: false }, formData);
      if (res.ok) onDone();
      else setError(res.error ?? "Gagal menyimpan.");
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 space-y-3 rounded-2xl border border-dashed border-brown/30 bg-cream-soft p-5"
    >
      <h3 className="font-semibold text-ink">Tambah Rasa Baru</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>ID / slug</label>
          <input
            name="id"
            required
            placeholder="mis. greentea"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nama</label>
          <input
            name="name"
            required
            placeholder="mis. Greentea"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Deskripsi</label>
        <textarea name="description" rows={2} className={inputClass} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Warna</label>
          <input
            name="accent"
            type="color"
            defaultValue="#8c5a3c"
            className="h-10 w-16 cursor-pointer rounded-lg border border-brown/20"
          />
        </div>
        <div>
          <label className={labelClass}>Path gambar</label>
          <input
            name="image"
            placeholder="/images/product3.png"
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-brown/20 px-5 py-2 text-sm text-ink/70 transition hover:bg-cream"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function FlavorCard({ flavor }: { flavor: Flavor }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editPending, startEdit] = useTransition();
  const [delPending, startDelete] = useTransition();
  const [editError, setEditError] = useState<string | null>(null);
  const [delError, setDelError] = useState<string | null>(null);

  function onEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setEditError(null);
    startEdit(async () => {
      const res = await updateFlavor({ ok: false }, formData);
      if (res.ok) setEditing(false);
      else setEditError(res.error ?? "Gagal menyimpan.");
    });
  }

  function onDelete() {
    setDelError(null);
    const formData = new FormData();
    formData.set("id", flavor.id);
    startDelete(async () => {
      const res = await deleteFlavor({ ok: false }, formData);
      if (!res.ok) setDelError(res.error ?? "Gagal menghapus.");
    });
  }

  if (editing) {
    return (
      <form
        onSubmit={onEdit}
        className="space-y-3 rounded-2xl border border-brown/15 bg-cream p-4"
      >
        <div>
          <label className={labelClass}>Nama</label>
          <input
            name="name"
            defaultValue={flavor.name}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Deskripsi</label>
          <textarea
            name="description"
            defaultValue={flavor.description}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Warna</label>
          <input
            name="accent"
            type="color"
            defaultValue={flavor.accent}
            className="h-9 w-14 cursor-pointer rounded-lg border border-brown/20"
          />
        </div>
        {editError && <p className="text-xs text-terracotta">{editError}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={editPending}
            className="rounded-full bg-terracotta px-4 py-1.5 text-sm text-white transition hover:bg-brown disabled:opacity-60"
          >
            {editPending ? "..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-full border border-brown/20 px-4 py-1.5 text-sm text-ink/70 transition hover:bg-cream-soft"
          >
            Batal
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-brown/15 bg-cream p-4">
      <div className="flex gap-3">
        <div
          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
          style={{ backgroundColor: `${flavor.accent}14` }}
        >
          <Image
            src={flavor.image}
            alt={flavor.name}
            fill
            sizes="64px"
            className="object-contain p-1.5"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: flavor.accent }}
            />
            <h3 className="truncate font-semibold text-ink">{flavor.name}</h3>
          </div>
          <p className="mt-0.5 text-xs text-ink/40">{flavor.id}</p>
          <p className="mt-1 line-clamp-2 text-sm text-ink/70">
            {flavor.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-brown/10 pt-3">
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-brown/20 px-3 py-1.5 text-xs text-ink/70 transition hover:bg-cream-soft"
        >
          <FiEdit2 /> Edit
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-brown/20 px-3 py-1.5 text-xs text-ink/70 transition hover:bg-cream-soft"
          >
            <FiTrash2 /> Hapus
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink/60">Yakin?</span>
            <button
              onClick={onDelete}
              disabled={delPending}
              className="text-xs font-medium text-terracotta disabled:opacity-60"
            >
              {delPending ? "..." : "Ya, hapus"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-ink/50"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      {delError && <p className="mt-2 text-xs text-terracotta">{delError}</p>}
    </div>
  );
}

export default function FlavorManager({ flavors }: { flavors: Flavor[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">
          Daftar Rasa ({flavors.length})
        </h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-cream transition hover:bg-brown"
        >
          <FiPlus /> Tambah Rasa
        </button>
      </div>

      {adding && <AddFlavorForm onDone={() => setAdding(false)} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flavors.map((f) => (
          <FlavorCard key={f.id} flavor={f} />
        ))}
      </div>
    </div>
  );
}
