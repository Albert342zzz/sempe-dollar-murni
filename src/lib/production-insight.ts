import { GoogleGenAI } from "@google/genai";
import type { ProductionPlan } from "@/lib/production-plan";

// =============================================================================
// PRODUCTION PLAN NARRATIVE
// =============================================================================
// PRIVACY: only receives aggregate quantities (per flavor/size forecasts).
// No customer names or individual transactions. Safe on the Gemini free tier.
// =============================================================================

const CHAT_MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    });
  }
  return client;
}

function aiEnabled(): boolean {
  return process.env.USE_AI_INSIGHT !== "false";
}

function summarize(p: ProductionPlan): string {
  const list = (items: ProductionPlan["byFlavor"], n = 8) =>
    items
      .slice(0, n)
      .map(
        (i) =>
          `- ${i.name}: siapkan ${i.recommended} pcs (bulan lalu ${i.lastMonth}, rata-rata ${i.average})`
      )
      .join("\n") || "- (tidak ada)";

  return `Rencana untuk: ${p.nextLabel}
Dasar: ${p.basis === "trend" ? `tren ${p.monthCount} bulan` : "1 bulan data"}
Total disarankan: ${p.totalRecommended} pcs (bulan lalu ${p.totalLastMonth} pcs)

Per rasa:
${list(p.byFlavor)}

Per ukuran:
${list(p.bySize)}`;
}

// Template narrative (no AI) — always available as a fallback.
export function templateProductionInsight(p: ProductionPlan): string {
  if (p.monthCount === 0 || !p.nextLabel) {
    return "Belum ada data penjualan untuk menyusun rencana produksi.";
  }
  const parts: string[] = [
    `Untuk ${p.nextLabel}, siapkan sekitar ${p.totalRecommended} pcs total` +
      (p.totalLastMonth > 0 ? ` (bulan lalu ${p.totalLastMonth} pcs).` : "."),
  ];
  const topF = p.byFlavor[0];
  if (topF) parts.push(`Rasa prioritas: ${topF.name} (~${topF.recommended} pcs).`);
  const topS = p.bySize[0];
  if (topS) parts.push(`Ukuran paling banyak: ${topS.name} (~${topS.recommended} pcs).`);
  if (p.basis === "single-month") {
    parts.push("Baru ada 1 bulan data, jadi angka ini mengikuti bulan terakhir — akan makin akurat seiring bertambahnya laporan.");
  }
  return parts.join(" ");
}

// Gemini narrative (falls back to the template on error or when disabled).
export async function buildProductionInsight(p: ProductionPlan): Promise<string> {
  if (p.monthCount === 0 || !aiEnabled()) return templateProductionInsight(p);

  try {
    const prompt = `Kamu perencana produksi untuk UMKM keripik Sempe Dollar Murni. Berdasarkan ANGKA prakiraan kuantitas berikut, tulis rekomendasi produksi singkat dalam Bahasa Indonesia (3-5 kalimat, praktis untuk pemilik usaha). Sebutkan fokus rasa & ukuran prioritas, ingatkan soal bahan/stok bila relevan, dan beri 1 saran actionable. Jangan mengarang angka di luar data.

DATA (satuan pcs):
${summarize(p)}`;

    const res = await getClient().models.generateContent({
      model: CHAT_MODEL,
      contents: prompt,
      config: { maxOutputTokens: 600, thinkingConfig: { thinkingBudget: 0 } },
    });
    const text = res.text?.trim();
    return text && text.length > 0 ? text : templateProductionInsight(p);
  } catch (err) {
    console.error("Production insight AI error:", err);
    return templateProductionInsight(p);
  }
}
