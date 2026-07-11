"use server";

import { isAdmin } from "@/lib/require-admin";
import { getSalesAnalytics } from "@/lib/sales-analytics";
import { buildTrendInsight } from "@/lib/sales-analytics-insight";

// Generate the AI trend-analysis narrative (button-triggered to save quota).
export async function generateTrendInsight(): Promise<{
  ok: boolean;
  text?: string;
  error?: string;
}> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const analytics = await getSalesAnalytics();
  const text = await buildTrendInsight(analytics);
  return { ok: true, text };
}
