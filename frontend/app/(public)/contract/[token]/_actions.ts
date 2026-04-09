"use server";

import { api } from "@/lib/api";

export async function acceptContractAction(token: string) {
  const res = await api(`/contract/${token}/accept`, { method: "POST" });
  if (!res.ok) return { ok: false as const, error: res.error };
  return { ok: true as const };
}

export async function rejectContractAction(token: string) {
  const res = await api(`/contract/${token}/reject`, { method: "POST" });
  if (!res.ok) return { ok: false as const, error: res.error };
  return { ok: true as const };
}
