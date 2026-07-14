"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdDragIndicator } from "react-icons/md";
import {
  FiUploadCloud,
  FiImage,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import {
  replaceGalleryImage,
  updateGalleryAlt,
  deleteGalleryImage,
  reorderGalleryImages,
} from "@/app/admin/gallery/actions";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";

type Img = { id: number; url: string; alt: string };

const PAGE_OPTIONS: { label: string; value: number }[] = [
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "20", value: 20 },
  { label: "Max", value: Infinity },
];

export default function GalleryManager({ images }: { images: Img[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Img[]>(images);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [savingOrder, startOrderTransition] = useTransition();

  // Sync with server data when it changes (after a refresh).
  useEffect(() => {
    setItems(images);
  }, [images]);

  // Drag & drop state.
  const [dragId, setDragId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  const total = items.length;
  const totalPages = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const visible =
    pageSize === Infinity
      ? items
      : items.slice((current - 1) * pageSize, current * pageSize);

  function refresh() {
    router.refresh();
  }

  function handleDrop(targetId: number) {
    const from = items.findIndex((x) => x.id === dragId);
    const to = items.findIndex((x) => x.id === targetId);
    setDragId(null);
    setOverId(null);
    if (from === -1 || to === -1 || from === to) return;

    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    startOrderTransition(async () => {
      await reorderGalleryImages(next.map((x) => x.id));
    });
  }

  const dnd = {
    dragId,
    overId,
    start: (id: number) => setDragId(id),
    over: (id: number) => setOverId(id),
    end: () => {
      setDragId(null);
      setOverId(null);
    },
    drop: handleDrop,
  };

  return (
    <div className="space-y-6">
      <AddForm onDone={refresh} />

      {items.length === 0 ? (
        <p className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
          Belum ada foto. Tambahkan foto pertama di atas.
        </p>
      ) : (
        <>
          {/* Controls: count + per-page size */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink/50">
              {total} foto
              {savingOrder && (
                <span className="ml-2 inline-flex items-center gap-1.5 text-terracotta">
                  <Spinner className="h-3 w-3" /> menyimpan urutan…
                </span>
              )}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-xs text-ink/50">Per halaman:</span>
              {PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setPageSize(opt.value);
                    setPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs transition ${
                    pageSize === opt.value
                      ? "bg-terracotta text-white"
                      : "border border-brown/20 text-ink/60 hover:bg-cream-soft"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            {visible.map((img) => (
              <Row key={img.id} img={img} dnd={dnd} onDone={refresh} />
            ))}
          </div>

          {/* Pagination */}
          {pageSize !== Infinity && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setPage(current - 1)}
                disabled={current <= 1}
                className="rounded-lg border border-brown/20 px-3 py-1.5 text-sm text-ink/70 transition hover:bg-cream-soft disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-ink/60">
                Halaman {current} / {totalPages}
              </span>
              <button
                onClick={() => setPage(current + 1)}
                disabled={current >= totalPages}
                className="rounded-lg border border-brown/20 px-3 py-1.5 text-sm text-ink/70 transition hover:bg-cream-soft disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type Dnd = {
  dragId: number | null;
  overId: number | null;
  start: (id: number) => void;
  over: (id: number) => void;
  end: () => void;
  drop: (id: number) => void;
};

function Row({
  img,
  dnd,
  onDone,
}: {
  img: Img;
  dnd: Dnd;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [alt, setAlt] = useState(img.alt);
  const [editing, setEditing] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const isDragging = dnd.dragId === img.id;
  const isOver = dnd.overId === img.id && dnd.dragId !== img.id;

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) window.alert(res.error ?? "Gagal.");
      else onDone();
    });
  }

  function onReplace(file: File | undefined) {
    if (!file) return;
    const fd = new FormData();
    fd.append("id", String(img.id));
    fd.append("file", file);
    run(() => replaceGalleryImage(fd));
  }

  function saveAlt() {
    const clean = alt.trim();
    if (!clean || clean === img.alt) {
      setEditing(false);
      return;
    }
    run(() => updateGalleryAlt(img.id, clean));
    setEditing(false);
  }

  function cancelEdit() {
    setAlt(img.alt);
    setEditing(false);
  }

  return (
    <div
      ref={rowRef}
      onDragOver={(e) => {
        e.preventDefault();
        if (dnd.overId !== img.id) dnd.over(img.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dnd.drop(img.id);
      }}
      className={`flex items-center gap-3 rounded-xl border bg-cream px-3 py-2.5 transition ${
        isDragging ? "opacity-40" : ""
      } ${isOver ? "border-terracotta ring-1 ring-terracotta/30" : "border-brown/15"}`}
    >
      {/* Drag handle */}
      <button
        draggable
        onDragStart={(e) => {
          dnd.start(img.id);
          e.dataTransfer.effectAllowed = "move";
          if (rowRef.current) e.dataTransfer.setDragImage(rowRef.current, 20, 20);
        }}
        onDragEnd={dnd.end}
        aria-label="Geser untuk mengurutkan"
        className="shrink-0 cursor-grab text-ink/30 transition hover:text-ink/60 active:cursor-grabbing"
      >
        <MdDragIndicator className="text-xl" />
      </button>

      {/* Small thumbnail */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-soft">
        <Image
          src={img.url}
          alt={img.alt}
          fill
          sizes="48px"
          className="object-cover"
          draggable={false}
        />
        {pending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Spinner className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {editing ? (
        <>
          <input
            autoFocus
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveAlt();
              if (e.key === "Escape") cancelEdit();
            }}
            placeholder="Deskripsi foto"
            className="min-w-0 flex-1 rounded-lg border border-brown/20 bg-cream-soft px-3 py-1.5 text-sm text-ink outline-none transition focus:border-terracotta"
          />
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={saveAlt}
              disabled={pending}
              title="Simpan"
              aria-label="Simpan"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive/15 text-olive transition hover:bg-olive/25"
            >
              <FiCheck />
            </button>
            <button
              onClick={cancelEdit}
              disabled={pending}
              title="Batal"
              aria-label="Batal"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-cream-soft hover:text-ink"
            >
              <FiX />
            </button>
          </div>
        </>
      ) : (
        <>
          <p
            className="min-w-0 flex-1 truncate text-sm text-ink/80"
            title={img.alt}
          >
            {img.alt}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            {/* 1. Replace photo */}
            <label
              title="Ganti foto"
              aria-label="Ganti foto"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-ink/50 transition hover:bg-cream-soft hover:text-ink"
            >
              <FiRefreshCw />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={pending}
                onChange={(e) => onReplace(e.target.files?.[0])}
              />
            </label>

            {/* 2. Edit description */}
            <button
              onClick={() => setEditing(true)}
              disabled={pending}
              title="Edit deskripsi"
              aria-label="Edit deskripsi"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-cream-soft hover:text-ink"
            >
              <FiEdit2 />
            </button>

            {/* 3. Delete */}
            <button
              onClick={() => {
                if (window.confirm("Hapus foto ini?"))
                  run(() => deleteGalleryImage(img.id));
              }}
              disabled={pending}
              title="Hapus"
              aria-label="Hapus"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-red-50 hover:text-red-500"
            >
              <FiTrash2 />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AddForm({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null); // null = idle
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = progress !== null;

  function submit() {
    if (!file || busy) return;
    setError(null);
    setProgress(0);
    setProcessing(false);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/gallery");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    // Byte upload finished — the server starts processing.
    xhr.upload.onload = () => setProcessing(true);

    xhr.onload = () => {
      setProgress(null);
      setProcessing(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setFile(null);
        setAlt("");
        if (inputRef.current) inputRef.current.value = "";
        setOpen(false);
        onDone();
      } else {
        let msg = "Gagal menambah foto.";
        try {
          msg = JSON.parse(xhr.responseText).error ?? msg;
        } catch {}
        setError(msg);
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setProcessing(false);
      setError("Gagal mengunggah.");
    };

    xhr.send(fd);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2.5 text-sm text-white transition hover:bg-brown"
      >
        <FiUploadCloud /> Tambah Foto
      </button>

      {open && (
        <Modal
          title="Tambah Foto"
          icon={<FiUploadCloud className="text-xl" />}
          onClose={() => setOpen(false)}
          dismissable={!busy}
        >
          <p className="text-sm text-ink/60">
            JPG, PNG, WEBP, atau GIF — maks 3 MB.
          </p>

          <div className="mt-4 space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border border-brown/20 bg-cream-soft px-4 py-2.5 text-sm text-ink transition hover:bg-cream ${
                busy ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <FiImage className="text-base" />
              {file ? "Ganti file" : "Pilih foto"}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  setError(null);
                  setFile(e.target.files?.[0] ?? null);
                }}
              />
            </label>

            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Deskripsi foto (opsional)"
              disabled={busy}
              className="w-full rounded-lg border border-brown/20 bg-cream-soft px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta"
            />
          </div>

          {file && !busy && (
            <p className="mt-2 truncate text-xs text-ink/50">
              Terpilih: <span className="text-ink/70">{file.name}</span>
            </p>
          )}

          {/* Progress bar */}
          {busy && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-cream-soft">
                <div
                  className="h-full rounded-full bg-terracotta transition-all duration-200"
                  style={{ width: `${processing ? 100 : progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink/50">
                {processing ? "Memproses…" : `Mengunggah ${progress}%`}
              </p>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => !busy && setOpen(false)}
              className="rounded-lg border border-brown/20 px-4 py-2 text-sm text-ink/70 transition hover:bg-cream-soft"
            >
              Batal
            </button>
            <button
              onClick={submit}
              disabled={!file || busy}
              className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Spinner className="h-4 w-4" />}
              {busy ? "Mengunggah…" : "Tambah"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
