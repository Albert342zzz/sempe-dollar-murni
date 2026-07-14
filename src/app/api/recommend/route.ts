import { GoogleGenAI } from "@google/genai";
import { flavors } from "@/lib/flavors";

// Flavor recommendation based on customer preference (Gemini + template fallback).

export const runtime = "nodejs";

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

const menu = flavors.map((f) => `- ${f.name}: ${f.description}`).join("\n");

// Fallback recommendation (no AI) — match preference keywords to flavors.
function fallbackRecommendation(pref: string): string {
  const p = pref.toLowerCase();
  const has = (...ks: string[]) => ks.some((k) => p.includes(k));

  let picks: string[];
  if (has("kopi", "cappuc", "mocha", "mocca")) picks = ["Kopi", "Cappuccino", "Mocha"];
  else if (has("cokelat", "coklat", "brownies")) picks = ["Cokelat", "Brownies", "Mocha"];
  else if (has("buah", "pisang", "durian", "coco", "segar")) picks = ["Pisang", "Cocopandan", "Durian"];
  else if (has("gurih", "asin", "keju")) picks = ["Wijen", "Keju"];
  else if (has("manis")) picks = ["Pisang", "Cocopandan", "Cokelat"];
  else if (has("kado", "hampers", "hadiah")) picks = ["Keju", "Cokelat", "Cappuccino"];
  else picks = ["Wijen", "Keju", "Cokelat"];

  return `Kalau kamu suka yang seperti itu, coba rasa ${picks
    .slice(0, -1)
    .join(", ")} atau ${picks[picks.length - 1]} kak — favorit banyak pelanggan! 🙂`;
}

export async function POST(req: Request) {
  let pref = "";
  try {
    const body = await req.json();
    pref = String(body?.preference ?? "").trim().slice(0, 200);
  } catch {
    return Response.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  if (!pref) return Response.json({ error: "Preferensi kosong." }, { status: 400 });

  const useAi = process.env.USE_AI_INSIGHT !== "false";
  if (!useAi) return Response.json({ text: fallbackRecommendation(pref) });

  try {
    const prompt = `Kamu "Mbak Sempe", asisten Sempe Dollar Murni. Pelanggan mencari rekomendasi rasa Sempe. Preferensi mereka: "${pref}".

Dari DAFTAR RASA berikut, pilih 2-3 rasa yang paling cocok. Jawab Bahasa Indonesia yang ramah & singkat (maksimal 3 kalimat), panggil "kak", sebutkan nama rasanya dengan jelas beserta alasan singkat. HANYA rekomendasikan rasa dari daftar; jangan mengarang rasa lain.

DAFTAR RASA:
${menu}`;

    const res = await getClient().models.generateContent({
      model: CHAT_MODEL,
      contents: prompt,
      config: { maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 } },
    });
    const text = res.text?.trim();
    return Response.json({ text: text && text.length > 0 ? text : fallbackRecommendation(pref) });
  } catch (err) {
    console.error("Recommend AI error:", err);
    return Response.json({ text: fallbackRecommendation(pref) });
  }
}
