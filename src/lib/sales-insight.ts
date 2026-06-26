import { GoogleGenAI } from "@google/genai";
import { formatRupiah } from "@/lib/flavors";
import type { SalesAggregates } from "@/lib/sales-parser";

// =============================================================================
// SALES REPORT INSIGHT NARRATIVE
// =============================================================================
// PRIVACY: this function only receives aggregate numbers (totals per flavor/size).
// No customer names, phone numbers, or individual transaction rows are sent to AI.
// Safe to use even on the Gemini free tier.
//
// Set USE_AI_INSIGHT=false (env) to use the template narrative instead of AI.
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

function list(items: { label: string; qty: number; amount: number }[], n = 6) {
  return (
    items
      .slice(0, n)
      .map((b) => `- ${b.label}: ${b.qty} pcs, ${formatRupiah(b.amount)}`)
      .join("\n") || "- (tidak ada)"
  );
}

function aggregatesSummary(a: SalesAggregates, periodLabel: string): string {
  return `Periode: ${periodLabel}
Total penjualan: ${formatRupiah(a.totalAmount)} dari ${a.totalQty} pcs (${a.validRows} baris).

Penjualan per rasa:
${list(a.byFlavor)}

Penjualan per ukuran:
${list(a.bySize)}

Produk terlaris:
${list(a.byProduct)}`;
}

// Template narrative (no AI) — always available as a fallback.
export function templateInsight(a: SalesAggregates, periodLabel: string): string {
  if (a.validRows === 0) {
    return "Tidak ada baris penjualan yang terbaca dari file ini.";
  }
  const parts = [
    `Periode ${periodLabel}: total penjualan ${formatRupiah(a.totalAmount)} dari ${a.totalQty} pcs.`,
  ];
  if (a.byProduct[0]) {
    const p = a.byProduct[0];
    parts.push(`Produk terlaris: ${p.label} (${p.qty} pcs, ${formatRupiah(p.amount)}).`);
  }
  if (a.byFlavor[0]) parts.push(`Rasa favorit: ${a.byFlavor[0].label}.`);
  if (a.bySize[0]) parts.push(`Ukuran paling laku: ${a.bySize[0].label}.`);
  return parts.join(" ");
}

// Generate insight: use Gemini if enabled, fall back to template on error or if disabled.
export async function buildInsight(
  a: SalesAggregates,
  periodLabel: string
): Promise<string> {
  if (a.validRows === 0) return templateInsight(a, periodLabel);
  if (!aiEnabled()) return templateInsight(a, periodLabel);

  try {
    const prompt = `Kamu analis penjualan untuk UMKM keripik Sempe Dollar Murni. Berdasarkan ANGKA agregat penjualan satu periode berikut, tulis ringkasan insight singkat dalam Bahasa Indonesia (2-4 kalimat, santai tapi informatif). Sebut produk/rasa/ukuran terlaris dan satu saran praktis bila relevan. Jangan mengarang angka di luar data.

DATA:
${aggregatesSummary(a, periodLabel)}`;

    const res = await getClient().models.generateContent({
      model: CHAT_MODEL,
      contents: prompt,
      config: { maxOutputTokens: 512, thinkingConfig: { thinkingBudget: 0 } },
    });

    const text = res.text?.trim();
    return text && text.length > 0 ? text : templateInsight(a, periodLabel);
  } catch (err) {
    console.error("Insight AI error:", err);
    return templateInsight(a, periodLabel);
  }
}
