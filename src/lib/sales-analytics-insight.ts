import { GoogleGenAI } from "@google/genai";
import { formatRupiah } from "@/lib/flavors";
import type { Analytics } from "@/lib/sales-analytics";

// =============================================================================
// CROSS-REPORT ANALYTICS NARRATIVE
// =============================================================================
// PRIVACY: only receives aggregate numbers (monthly totals, anomalies, forecast).
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

function pct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;
}

function summarize(a: Analytics): string {
  const trend = a.months.map((m) => `- ${m.label}: ${formatRupiah(m.amount)}`).join("\n");
  const anomalies = a.anomalies.length
    ? a.anomalies
        .map(
          (an) =>
            `- ${an.label} · ${an.dimension} "${an.name}": ${pct(an.deviationPct)} dari rata-rata (${formatRupiah(an.value)} vs ${formatRupiah(Math.round(an.mean))})`
        )
        .join("\n")
    : "- (tidak ada anomali menonjol)";
  return `Total penjualan per bulan:
${trend}

Pertumbuhan bulan terakhir: ${a.momGrowthPct === null ? "—" : pct(a.momGrowthPct)}
Bulan terbaik: ${a.bestMonth ? `${a.bestMonth.label} (${formatRupiah(a.bestMonth.amount)})` : "—"}
Prakiraan bulan depan: ${a.forecast ? `${a.forecast.label} ≈ ${formatRupiah(a.forecast.amount)}` : "—"}

Anomali menonjol:
${anomalies}`;
}

// Template narrative (no AI) — fallback.
export function templateTrendInsight(a: Analytics): string {
  if (a.monthCount < 2) {
    return "Perlu minimal 2 laporan bulan berbeda untuk analisis tren.";
  }
  const parts: string[] = [];
  if (a.momGrowthPct !== null) {
    parts.push(
      `Penjualan bulan terakhir ${a.momGrowthPct >= 0 ? "naik" : "turun"} ${pct(a.momGrowthPct)} dibanding bulan sebelumnya.`
    );
  }
  if (a.bestMonth) parts.push(`Bulan terbaik sejauh ini: ${a.bestMonth.label}.`);
  if (a.anomalies[0]) {
    const an = a.anomalies[0];
    parts.push(
      `Sorotan: ${an.dimension} "${an.name}" pada ${an.label} ${an.direction} ${pct(an.deviationPct)} dari rata-rata.`
    );
  }
  if (a.forecast) parts.push(`Perkiraan bulan depan sekitar ${formatRupiah(a.forecast.amount)}.`);
  return parts.join(" ");
}

// Gemini narrative (falls back to the template on error or when disabled).
export async function buildTrendInsight(a: Analytics): Promise<string> {
  if (a.monthCount < 2) return templateTrendInsight(a);
  if (!aiEnabled()) return templateTrendInsight(a);

  try {
    const prompt = `Kamu analis data untuk UMKM keripik Sempe Dollar Murni. Berdasarkan ANGKA agregat lintas-bulan berikut, tulis analisis tren singkat dalam Bahasa Indonesia (3-5 kalimat, santai tapi tajam). Soroti tren pertumbuhan, anomali paling penting (jelaskan kemungkinan artinya), dan beri 1 saran praktis. Jangan mengarang angka di luar data.

DATA:
${summarize(a)}`;

    const res = await getClient().models.generateContent({
      model: CHAT_MODEL,
      contents: prompt,
      config: { maxOutputTokens: 600, thinkingConfig: { thinkingBudget: 0 } },
    });
    const text = res.text?.trim();
    return text && text.length > 0 ? text : templateTrendInsight(a);
  } catch (err) {
    console.error("Trend insight AI error:", err);
    return templateTrendInsight(a);
  }
}
