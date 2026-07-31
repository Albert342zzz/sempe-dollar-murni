"use server";

import { isAdmin } from "@/lib/require-admin";
import { getProductionPlan } from "@/lib/production-plan";
import { buildProductionInsight } from "@/lib/production-insight";

// Generate the AI production recommendation (button-triggered to save quota).
export async function generateProductionInsight(): Promise<{
  ok: boolean;
  text?: string;
  error?: string;
}> {
  if (!(await isAdmin())) return { ok: false, error: "Tidak diizinkan." };

  const plan = await getProductionPlan();
  const text = await buildProductionInsight(plan);
  return { ok: true, text };
}
