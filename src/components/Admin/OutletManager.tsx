"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiEdit2, FiTrash2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { addOutlet, updateOutlet, deleteOutlet } from "@/app/admin/outlets/actions";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";

type Outlet = { id: number; name: string; address: string };

const inputClass =
  "w-full rounded-lg border border-brown/20 bg-cream-soft px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta";

const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export default function OutletManager({ outlets }: { outlets: Outlet[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-5">
      <button
        onClick={() => setAdding(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2.5 text-sm text-white transition hover:bg-brown"
      >
        <FiPlus /> Tambah Cabang
      </button>

      {adding && <AddModal onClose={() => setAdding(false)} />}

      {outlets.length === 0 ? (
        <p className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
          Belum ada cabang/toko. Section &quot;Temukan Produk Kami di&quot; di
          halaman Kontak akan disembunyikan sampai ada minimal satu.
        </p>
      ) : (
        <div className="space-y-2">
          {outlets.map((o) => (
            <Row key={o.id} outlet={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!name.trim() || !address.trim() || pending) return;
    setError(null);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("address", address);
    start(async () => {
      const res = await addOutlet(fd);
      if (!res.ok) {
        setError(res.error ?? "Gagal menambah.");
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal
      title="Tambah Cabang / Toko"
      icon={<FiMapPin />}
      onClose={onClose}
      dismissable={!pending}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="outlet-name" className={labelClass}>
            Nama Toko
          </label>
          <input
            id="outlet-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Toko"
            disabled={pending}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="outlet-address" className={labelClass}>
            Alamat
          </label>
          <textarea
            id="outlet-address"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap toko"
            disabled={pending}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => !pending && onClose()}
          className="rounded-lg border border-brown/20 px-4 py-2 text-sm text-ink/70 transition hover:bg-cream-soft"
        >
          Batal
        </button>
        <button
          onClick={submit}
          disabled={!name.trim() || !address.trim() || pending}
          className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <Spinner className="h-4 w-4" /> : <FiPlus />}
          Tambah
        </button>
      </div>
    </Modal>
  );
}

function Row({ outlet }: { outlet: Outlet }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(outlet.name);
  const [address, setAddress] = useState(outlet.address);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) {
    start(async () => {
      const res = await fn();
      if (!res.ok) window.alert(res.error ?? "Gagal.");
      else {
        after?.();
        router.refresh();
      }
    });
  }

  function save() {
    if (!name.trim() || !address.trim()) return;
    run(() => updateOutlet(outlet.id, name, address), () => setEditing(false));
  }

  function cancel() {
    setName(outlet.name);
    setAddress(outlet.address);
    setEditing(false);
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-brown/15 bg-cream px-4 py-3">
      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta">
        <FiMapPin />
      </span>

      {editing ? (
        <div className="flex-1 space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama toko"
            className={inputClass}
          />
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat"
            className={`${inputClass} resize-none`}
          />
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{outlet.name}</p>
          <p className="text-sm text-ink/60">{outlet.address}</p>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <button
              onClick={save}
              disabled={pending}
              title="Simpan"
              aria-label="Simpan"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive/15 text-olive transition hover:bg-olive/25"
            >
              {pending ? <Spinner className="h-4 w-4" /> : <FiCheck />}
            </button>
            <button
              onClick={cancel}
              disabled={pending}
              title="Batal"
              aria-label="Batal"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-cream-soft hover:text-ink"
            >
              <FiX />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              disabled={pending}
              title="Edit"
              aria-label="Edit"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-cream-soft hover:text-ink"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Hapus "${outlet.name}"?`))
                  run(() => deleteOutlet(outlet.id));
              }}
              disabled={pending}
              title="Hapus"
              aria-label="Hapus"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-red-50 hover:text-red-500"
            >
              <FiTrash2 />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
