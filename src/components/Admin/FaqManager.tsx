"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FiHelpCircle,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { addFaq, updateFaq, deleteFaq, moveFaq } from "@/app/admin/faq/actions";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";

export type Faq = { id: number; question: string; answer: string };

const inputClass =
  "w-full rounded-lg border border-brown/20 bg-cream-soft px-3 py-2 text-sm text-ink outline-none transition focus:border-terracotta";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export default function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-5">
      <button
        onClick={() => setAdding(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2.5 text-sm text-white transition hover:bg-brown"
      >
        <FiPlus /> Tambah Pertanyaan
      </button>

      {adding && <AddModal onClose={() => setAdding(false)} />}

      {faqs.length === 0 ? (
        <p className="rounded-2xl border border-brown/15 bg-cream p-10 text-center text-sm text-ink/50">
          Belum ada pertanyaan. Section FAQ di halaman Kontak akan disembunyikan
          sampai ada minimal satu.
        </p>
      ) : (
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <Row
              key={f.id}
              faq={f}
              isFirst={i === 0}
              isLast={i === faqs.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const valid = question.trim() && answer.trim();

  function submit() {
    if (!valid || pending) return;
    setError(null);
    const fd = new FormData();
    fd.append("question", question);
    fd.append("answer", answer);
    start(async () => {
      const res = await addFaq(fd);
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
      title="Tambah Pertanyaan"
      icon={<FiHelpCircle />}
      onClose={onClose}
      dismissable={!pending}
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Pertanyaan</label>
          <input
            autoFocus
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="mis. Apakah produk bersertifikat halal?"
            disabled={pending}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Jawaban</label>
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tuliskan jawaban yang jelas dan ramah."
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
          disabled={!valid || pending}
          className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-2 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <Spinner className="h-4 w-4" /> : <FiPlus />}
          Tambah
        </button>
      </div>
    </Modal>
  );
}

function Row({
  faq,
  isFirst,
  isLast,
}: {
  faq: Faq;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);

  const valid = question.trim() && answer.trim();

  function run(
    fn: () => Promise<{ ok: boolean; error?: string }>,
    after?: () => void
  ) {
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
    if (!valid) return;
    const fd = new FormData();
    fd.append("question", question);
    fd.append("answer", answer);
    run(() => updateFaq(faq.id, fd), () => setEditing(false));
  }

  function cancel() {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditing(false);
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-brown/15 bg-cream px-4 py-3">
      {/* Reorder controls */}
      <div className="flex flex-col">
        <button
          onClick={() => run(() => moveFaq(faq.id, "up"))}
          disabled={pending || isFirst || editing}
          title="Naikkan"
          aria-label="Naikkan"
          className="flex h-6 w-6 items-center justify-center rounded text-ink/40 transition hover:bg-cream-soft hover:text-ink disabled:opacity-30"
        >
          <FiChevronUp />
        </button>
        <button
          onClick={() => run(() => moveFaq(faq.id, "down"))}
          disabled={pending || isLast || editing}
          title="Turunkan"
          aria-label="Turunkan"
          className="flex h-6 w-6 items-center justify-center rounded text-ink/40 transition hover:bg-cream-soft hover:text-ink disabled:opacity-30"
        >
          <FiChevronDown />
        </button>
      </div>

      {editing ? (
        <div className="flex-1 space-y-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pertanyaan"
            className={inputClass}
          />
          <textarea
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Jawaban"
            className={`${inputClass} resize-none`}
          />
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{faq.question}</p>
          <p className="mt-1 whitespace-pre-line text-sm text-ink/60">
            {faq.answer}
          </p>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <button
              onClick={save}
              disabled={pending || !valid}
              title="Simpan"
              aria-label="Simpan"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive/15 text-olive transition hover:bg-olive/25 disabled:opacity-50"
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
                if (window.confirm(`Hapus pertanyaan "${faq.question}"?`))
                  run(() => deleteFaq(faq.id));
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
