"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiUploadCloud,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiCheck,
  FiRefreshCw,
  FiImage,
} from "react-icons/fi";
import {
  addGalleryImage,
  replaceGalleryImage,
  updateGalleryAlt,
  deleteGalleryImage,
  moveGalleryImage,
} from "@/app/admin/gallery/actions";
import Spinner from "@/components/Spinner";

type Img = { id: number; url: string; alt: string };

export default function GalleryManager({ images }: { images: Img[] }) {
  return (
    <div className="space-y-8">
      <AddForm />

      {images.length === 0 ? (
        <p className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
          Belum ada foto. Tambahkan foto pertama di atas.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <Card
              key={img.id}
              img={img}
              isFirst={i === 0}
              isLast={i === images.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt);
    startTransition(async () => {
      const res = await addGalleryImage(fd);
      if (!res.ok) {
        setError(res.error ?? "Gagal menambah foto.");
        return;
      }
      setFile(null);
      setAlt("");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-dashed border-brown/30 bg-cream p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          {pending ? <Spinner className="h-5 w-5" /> : <FiUploadCloud className="text-2xl" />}
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Tambah Foto</p>
          <p className="text-xs text-ink/50">JPG, PNG, WEBP, atau GIF — maks 3 MB.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-brown/20 bg-cream-soft px-4 py-2 text-sm text-ink transition hover:bg-cream ${
            pending ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <FiImage className="text-base" />
          {file ? "Ganti file" : "Pilih foto"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={pending}
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
          disabled={pending}
          className="min-w-52 flex-1 rounded-lg border border-brown/20 bg-cream-soft px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta"
        />

        <button
          onClick={submit}
          disabled={!file || pending}
          className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Spinner className="h-4 w-4" />}
          {pending ? "Mengunggah..." : "Tambah"}
        </button>
      </div>

      {file && !pending && (
        <p className="mt-3 truncate text-xs text-ink/50">
          Terpilih: <span className="text-ink/70">{file.name}</span>
        </p>
      )}
      {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}
    </div>
  );
}

function Card({
  img,
  isFirst,
  isLast,
}: {
  img: Img;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [alt, setAlt] = useState(img.alt);
  const replaceRef = useRef<HTMLInputElement>(null);
  const dirty = alt.trim() !== img.alt && alt.trim() !== "";

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) window.alert(res.error ?? "Gagal.");
      else router.refresh();
    });
  }

  function onReplace(file: File | undefined) {
    if (!file) return;
    const fd = new FormData();
    fd.append("id", String(img.id));
    fd.append("file", file);
    run(() => replaceGalleryImage(fd));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brown/15 bg-cream">
      <div className="relative aspect-square bg-cream-soft">
        <Image
          src={img.url}
          alt={img.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          unoptimized
        />
        {pending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Spinner className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        {/* Alt / description */}
        <div className="flex items-center gap-2">
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Deskripsi foto"
            className="min-w-0 flex-1 rounded-lg border border-brown/20 bg-cream-soft px-3 py-1.5 text-sm text-ink outline-none transition focus:border-terracotta"
          />
          {dirty && (
            <button
              onClick={() => run(() => updateGalleryAlt(img.id, alt))}
              disabled={pending}
              aria-label="Simpan deskripsi"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-olive/15 text-olive transition hover:bg-olive/25"
            >
              <FiCheck />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-brown/20 px-2.5 py-1.5 text-xs text-ink/70 transition hover:bg-cream-soft">
            <FiRefreshCw /> Ganti
            <input
              ref={replaceRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={pending}
              onChange={(e) => onReplace(e.target.files?.[0])}
            />
          </label>

          <button
            onClick={() => run(() => moveGalleryImage(img.id, "up"))}
            disabled={pending || isFirst}
            aria-label="Naikkan"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-brown/20 text-ink/60 transition hover:bg-cream-soft disabled:opacity-30"
          >
            <FiArrowUp />
          </button>
          <button
            onClick={() => run(() => moveGalleryImage(img.id, "down"))}
            disabled={pending || isLast}
            aria-label="Turunkan"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-brown/20 text-ink/60 transition hover:bg-cream-soft disabled:opacity-30"
          >
            <FiArrowDown />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Hapus foto ini?"))
                run(() => deleteGalleryImage(img.id));
            }}
            disabled={pending}
            aria-label="Hapus"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-red-50 hover:text-red-500"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
