"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function withdrawApplicationAction(id: string) {
  const res = await api(`/applications/${id}/withdraw`, { method: "PATCH" });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath("/dashboard/applications");
  return { ok: true as const };
}
