import { prisma } from "@/lib/prisma";
import FaqManager from "@/components/Admin/FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">FAQ</h1>
        <p className="text-sm text-ink/60">
          Kelola pertanyaan yang sering diajukan. Tampil sebagai accordion di
          halaman Kontak; jika kosong, section-nya otomatis disembunyikan.
          Gunakan panah untuk mengatur urutan.
        </p>
      </div>

      <FaqManager
        faqs={faqs.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
        }))}
      />
    </div>
  );
}
