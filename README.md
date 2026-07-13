# Sempe Dollar Murni — AI‑Integrated Company Profile & E‑Commerce

A full‑stack web app for **Sempe Dollar Murni**, a real Indonesian UMKM (small business) making traditional crunchy *Sempe* snacks in Temanggung since 1986. It combines a public storefront, a full admin panel, and **three AI features** — built to showcase full‑stack + AI engineering.

> **Live demo:** _add your Vercel URL here_ · **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Prisma 7 · Supabase · Google Gemini

<!-- Add a screenshot or the generated OG image here, e.g.: ![Preview](./docs/preview.png) -->

---

## ✨ Highlights

### Storefront (public)
- Product catalog with **per‑flavor × per‑size pricing** (10 flavors, 8 sizes)
- Interactive flavor showcase (each flavor themed by its own accent color)
- Cart & WhatsApp checkout — **guests order via WhatsApp**, logged‑in users get a multi‑flavor cart + order history
- Gallery with an admin‑managed image manager
- Google OAuth login, responsive design, skeleton loading states, a11y (keyboard focus, skip‑link), SEO + dynamic OpenGraph image

### Admin panel
- **Dashboard** — KPIs, monthly sales, top flavors, a colorblind‑safe **pie chart** (palette validated, not eyeballed)
- **Products** — flavor × size price matrix editor
- **Orders** — status workflow (Baru → Diproses → Selesai → Dibatalkan)
- **Reports** — upload the owner's messy monthly **Excel** → parsed, analyzed, visualized
- **Analytics** — cross‑report trends, anomaly detection & forecasting
- **Gallery** — drag‑and‑drop reorder, upload with real progress bar, images auto‑resized
- **Users** — role management (USER / ADMIN)
- Web‑traffic **Insight** (WhatsApp‑click / product‑view tracking)

### 🧠 AI features (Google Gemini)
1. **"Mbak Sempe" chat assistant** — streaming customer‑service chat; the system prompt is built live from the DB (flavors + current prices), so answers are always accurate.
2. **Sales‑report insight** — upload an Excel of a month's sales → deterministic parser extracts the numbers → Gemini narrates a summary.
3. **Cross‑report analytics** — statistics across all months (growth, z‑score anomalies, linear‑regression forecast) → Gemini turns the findings into a readable analysis.

---

## 🧩 The key engineering principle: **hybrid AI — code computes, AI narrates**

Every number is calculated by deterministic code; the LLM only *interprets and phrases* pre‑computed, **anonymized aggregates**. This keeps results accurate and reproducible, protects privacy (no customer names/transactions ever leave the server), and stays comfortably within the Gemini free tier. Every AI feature also has a **template fallback** (toggle `USE_AI_INSIGHT=false`).

```
Excel upload ─► SheetJS parse ─► deterministic math (totals, anomalies, forecast)
                                        │  (aggregates only — no PII)
                                        ▼
                              Google Gemini  ─►  natural‑language narrative
```

---

## 🏗️ Architecture

```
                 ┌────────────────────────── Next.js 16 (App Router) ──────────────────────────┐
  Browser ─────► │  Public routes  ·  Admin routes  ·  Route Handlers  ·  Server Actions        │
                 │        │                 │                  │                 │               │
                 │        ▼                 ▼                  ▼                 ▼               │
                 │   React 19 UI      proxy.ts (JWT       /api/chat        Prisma 7            │
                 │   Tailwind v4      admin guard)        (Gemini stream)  (driver adapter)    │
                 └────────────────────────────────────────────┬───────────────────┬────────────┘
                                                              │                   │
                                    Supabase Auth (Google) ◄──┘                   ▼
                                    Google Gemini API                    Supabase PostgreSQL
```

- **Dual auth:** Supabase session (customers) + a separate signed **JWT cookie** (jose) that gates `/admin/*` via `proxy.ts` middleware, issued only when the DB role is `ADMIN`. A 1‑hour client‑side session guard auto‑logs‑out.
- **Images in the DB:** gallery photos are stored as `Bytes`, resized to WebP with **sharp** on upload, and served through a cached route (`/api/gallery/[id]?v=updatedAt`).

---

## 🛠️ Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, Turbopack) · React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Supabase Auth (Google OAuth) + `jose` JWT for admin |
| AI | Google Gemini via `@google/genai` (streaming chat + narration) |
| Charts | Recharts (validated colorblind‑safe palette) |
| Excel | SheetJS (`xlsx`) |
| Images | `sharp` (resize → WebP) |

---

## 🚀 Getting started

**Prerequisites:** Node 20+, `pnpm`, a Supabase project, and a (free) Google AI Studio API key.

```bash
# 1. Install
pnpm install

# 2. Configure — copy the example and fill in real values
cp .env.example .env

# 3. Database — apply migrations & seed flavors/sizes/prices/gallery
pnpm prisma migrate deploy
pnpm prisma db seed

# 4. Run
pnpm dev            # http://localhost:3000
```

### Environment variables
See [`.env.example`](./.env.example) — `DATABASE_URL` / `DIRECT_URL` (Supabase), `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY`, `GEMINI_API_KEY`, and `NEXT_PUBLIC_SITE_URL`.

### First admin
New sign‑ups default to `USER`. Promote your account to `ADMIN` once via Prisma Studio (`pnpm prisma studio`) or SQL; afterwards roles are managed in **Admin → Pengguna**.

---

## ☁️ Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add all env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to the Vercel URL).
3. Deploy. Migrations run against Supabase; `sharp` and the Gemini/Prisma routes run on the Node runtime.

---

## 📁 Project structure (key parts)

```
src/
├─ app/
│  ├─ (public)/            # storefront: home, product, gallery, contact, cart, my-orders
│  ├─ admin/               # dashboard, products, orders, reports, analytics, gallery, users, insights
│  ├─ api/                 # chat (Gemini stream), gallery image serving/upload, orders, products
│  ├─ opengraph-image.tsx  # dynamic OG card · robots.ts · sitemap.ts
│  └─ auth/callback         # OAuth callback (issues admin JWT when role = ADMIN)
├─ components/             # UI (Header, Chat widget, admin managers, Recharts wrappers…)
├─ lib/                    # sales-parser, sales-analytics, *-insight (Gemini), auth, prisma…
└─ generated/prisma/       # generated Prisma client
prisma/                    # schema + migrations + seed
```

---

_Built as a portfolio project demonstrating full‑stack + AI integration on a real UMKM use case._
