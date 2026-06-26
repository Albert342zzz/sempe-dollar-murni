import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { contact } from "@/lib/contact";
import { formatRupiah } from "@/lib/flavors";

// "Mbak Sempe" AI assistant for customer questions. Uses Google Gemini (free tier) with plain-text streaming.

export const runtime = "nodejs";

// Fast free-tier Gemini model. Switch to "gemini-2.0-flash" if needed.
const CHAT_MODEL = "gemini-2.5-flash";

// Lazy-init so build and other routes don't fail when GEMINI_API_KEY is not set.
let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    });
  }
  return client;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

// Build system prompt with latest product data from the database.
async function buildSystemPrompt(): Promise<string> {
  const [flavors, flavorPrices] = await Promise.all([
    prisma.flavor.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.flavorPrice.findMany({ include: { size: true } }),
  ]);

  // Build price list: flavor → "size (price)".
  const priceByFlavor = new Map<string, string[]>();
  for (const fp of flavorPrices) {
    const list = priceByFlavor.get(fp.flavorId) ?? [];
    list.push(`${fp.size.label} ${formatRupiah(fp.price)}`);
    priceByFlavor.set(fp.flavorId, list);
  }

  const menuLines = flavors
    .map((f) => {
      const prices = priceByFlavor.get(f.id);
      const priceText = prices?.length
        ? prices.join(", ")
        : "harga belum tersedia";
      return `- ${f.name}: ${f.description} (${priceText})`;
    })
    .join("\n");

  return `Kamu adalah "Mbak Sempe", asisten layanan pelanggan untuk Sempe Dollar Murni — UMKM kue sempe renyah asal Temanggung sejak 1986.

GAYA BICARA:
- Pakai Bahasa Indonesia yang ramah, santai, dan hangat. Panggil pelanggan "kak".
- Jawaban singkat dan padat (maksimal 3-4 kalimat kecuali diminta detail). Jangan bertele-tele.
- Boleh pakai emoji sewajarnya 🙂. Jangan berlebihan.
- Jawab langsung tanpa basa-basi pembuka seperti "Tentu" atau "Baik".

TUGASMU: bantu pelanggan soal produk, rasa, harga, cara pesan, lokasi, dan jam buka. Kalau ditanya hal di luar Sempe Dollar Murni, tolak dengan sopan dan arahkan kembali ke produk.

DAFTAR RASA & HARGA (gunakan ini sebagai sumber harga resmi):
${menuLines}

CARA PESAN:
- Tanpa login: pelanggan bisa langsung pesan via WhatsApp ke ${contact.whatsappDisplay}.
- Dengan login (akun Google): bisa pakai keranjang untuk memesan banyak rasa sekaligus dan melihat riwayat pesanan.
- Jika pelanggan mau memesan, arahkan untuk klik tombol "Pesan via WhatsApp" di halaman Produk, atau hubungi WhatsApp ${contact.whatsappDisplay}.

INFO TOKO:
- Alamat: ${contact.address}
- Jam buka: ${contact.hours}
- WhatsApp: ${contact.whatsappDisplay}

ATURAN PENTING:
- Jangan mengarang harga, rasa, atau info yang tidak ada di atas. Kalau tidak tahu, sarankan menghubungi WhatsApp.
- Jangan menjanjikan diskon, stok, atau pengiriman yang tidak kamu ketahui — arahkan ke WhatsApp untuk konfirmasi.`;
}

export async function POST(req: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Permintaan tidak valid.", { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-12) // keep last 12 messages to stay within token budget
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response("Pesan tidak valid.", { status: 400 });
  }

  let system: string;
  try {
    system = await buildSystemPrompt();
  } catch {
    return new Response("Gagal memuat data produk.", { status: 500 });
  }

  // Gemini uses "user" / "model" roles with { role, parts } structure.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await getClient().models.generateContentStream({
          model: CHAT_MODEL,
          contents,
          config: {
            systemInstruction: system,
            maxOutputTokens: 1024,
            // Disable thinking for faster responses and to stay within free-tier quota.
            thinkingConfig: { thinkingBudget: 0 },
          },
        });

        for await (const chunk of aiStream) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        console.error("Chat AI error:", err);
        // Stream already started — send fallback message as plain text.
        controller.enqueue(
          encoder.encode(
            "Maaf kak, lagi ada kendala teknis 🙏 Silakan hubungi WhatsApp kami di " +
              contact.whatsappDisplay +
              " ya."
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
