# How the AI Works

This project uses AI (Google Gemini) in four places. This document explains, in plain English, what each one does and how it works under the hood — no machine‑learning background needed.

---

## The one idea that ties everything together: **code does the math, AI does the talking**

An LLM (Large Language Model) like Gemini is great at *language* — writing and summarizing in natural, human‑sounding text. But it is **not** reliable at exact arithmetic, and sending it private data has privacy costs.

So this app follows one simple rule everywhere:

> **Plain code calculates every number. The AI only turns already‑computed, anonymized numbers into readable sentences.**

Why this matters:

- **Accurate** — totals and percentages come from code, so they are always correct and reproducible (the AI can't "miscount").
- **Private** — the AI only ever sees aggregate numbers (e.g. *"size 3kg: 500 pcs"*), never customer names or individual transactions.
- **Cheap & reliable** — small prompts fit the Gemini free tier, and every feature has a **non‑AI fallback** so the site keeps working if the AI is turned off or errors out.

```
raw data ─► [ your code: parse + calculate ] ─► numbers / aggregates
                                                     │  (no private data)
                                                     ▼
                                        [ Gemini: write it in words ] ─► friendly text
```

---

## A few terms in plain English

- **LLM / Gemini** — a model that predicts text. You give it instructions + context (a "prompt"), and it writes a response.
- **Prompt** — the text you send the model: instructions plus the data it should use.
- **System prompt** — background instructions that set the AI's role and rules.
- **Streaming** — showing the answer word‑by‑word as it is generated (like the chat), instead of waiting for the whole thing.
- **RAG (Retrieval‑Augmented Generation)** — fetch the relevant facts first, put them into the prompt, so the AI answers from *your* data instead of guessing. We use a lightweight version.
- **Fallback** — a non‑AI backup that runs if the AI is disabled or fails.

---

## Shared setup

- **Model:** `gemini-2.5-flash` (fast and free‑tier friendly), via the official `@google/genai` SDK.
- **"Thinking" is disabled** for faster responses and to save quota.
- Needs `GEMINI_API_KEY` in `.env`. Without it, features gracefully use their non‑AI fallback.
- Setting `USE_AI_INSIGHT=false` forces the non‑AI fallback (no AI calls) for the report narrative, the analytics narrative, **and the flavor recommender**. The chat assistant is not affected by this toggle.

---

## 1. "Mbak Sempe" — the customer chat assistant

**What it is:** a floating chat bubble on the public site that answers questions about flavors, prices, how to order, location, and opening hours.

**How it works (a lightweight RAG):**

1. On each message, the server reads the **current** flavors and prices **from the database**.
2. It builds a **system prompt**: the assistant's persona + rules + a live price list.
3. Your recent message history is sent along with it to Gemini.
4. Gemini's answer is **streamed** back to the browser word‑by‑word.

Because prices are pulled from the database every time, the bot is always up to date — change a price in the admin panel and the chat reflects it immediately. It's instructed to use **only** the provided menu (so it won't invent prices) and to politely redirect off‑topic questions.

```
you type ─► server loads flavors+prices from DB ─► builds prompt ─► Gemini (streaming) ─► answer appears live
```

**Code:** `src/app/api/chat/route.ts` · **UI:** `src/components/Chat/ChatWidget.tsx`

---

## 2. Flavor recommender

**What it is:** on the Product page, a customer picks a taste (sweet, savory, coffee…) or types their own, and gets 2–3 suggested flavors.

**How it works:**

1. The preference is sent to the server.
2. The server puts the **whole flavor catalog** (names + descriptions) into the prompt and asks Gemini to pick 2–3 **from that list only**, with a short reason.
3. The UI scans the answer and highlights any mentioned flavors as badges.

If the AI is off or fails, a **keyword fallback** maps words like *"coffee"* / *"sweet"* to sensible flavors — so it always returns something useful.

**Code:** `src/app/api/recommend/route.ts` · **UI:** `src/components/Product/FlavorRecommender.tsx`

---

## 3. Sales‑report insight (admin)

**What it is:** the owner uploads a messy monthly **Excel** of sales; the app parses it and writes a short summary.

**How it works (hybrid):**

1. **Code** reads the Excel (SheetJS), understands the store's own shorthand codes (a flavor code column + one size code per column), and **calculates** the totals — per flavor, per size, and per product.
2. Only those **aggregate numbers** are sent to Gemini, which writes a 2–4 sentence summary (best sellers, a practical tip).

No customer names and no line‑by‑line transactions ever reach the AI — just totals. If the AI is off, a template sentence is generated instead.

**Code:** parser `src/lib/sales-parser.ts` · narrative `src/lib/sales-insight.ts`

---

## 4. Cross‑report analytics (admin)

**What it is:** once there are several monthly reports, an Analytics page shows trends, unusual months, and a next‑month estimate — with an AI write‑up.

**How it works (hybrid, more "data science"):**

1. **Code** computes, across all months:
   - **growth** — this month vs. the previous one,
   - **anomalies** — months that are far from the average, flagged with a simple statistical test (a **z‑score** combined with a ≥30% gap from the mean),
   - a **forecast** — next month's estimate using **linear regression** (a best‑fit line through the monthly totals).
2. These computed findings (again, aggregates only) are handed to Gemini, which explains them in plain language and suggests one action.

So the *statistics are real and deterministic*; the AI just makes them readable. If the AI is off, a template summary is used.

**Code:** math `src/lib/sales-analytics.ts` · narrative `src/lib/sales-analytics-insight.ts`

---

## Safety & privacy, in short

- **Only aggregates go to the AI** for reports/analytics — never PII or raw transactions.
- **Grounded** — the chat and recommender are told to use only the provided menu/data, which greatly reduces made‑up answers.
- **Guardrails** — message length and history limits, input size caps.
- **Always works** — every feature has a non‑AI fallback.
- **Free‑tier friendly** — small prompts, "thinking" disabled, and narratives are generated **on demand** (once when a report is uploaded, or on a button click) and then stored — never regenerated on every page load.

---

## File map

| Feature | Server logic | UI |
|---|---|---|
| Chat assistant | `src/app/api/chat/route.ts` | `src/components/Chat/ChatWidget.tsx` |
| Flavor recommender | `src/app/api/recommend/route.ts` | `src/components/Product/FlavorRecommender.tsx` |
| Report insight | `src/lib/sales-insight.ts` (+ `sales-parser.ts`) | admin → Laporan |
| Cross‑report analytics | `src/lib/sales-analytics-insight.ts` (+ `sales-analytics.ts`) | `src/app/admin/analytics/` |

---

_TL;DR — the numbers are always computed by ordinary code; Gemini is only ever asked to phrase pre‑computed, anonymized results in friendly language, with a plain‑code fallback if it's unavailable._
