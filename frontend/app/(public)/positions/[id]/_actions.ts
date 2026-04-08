"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";

export async function applyToPositionAction(positionId: string) {
  const res = await api(`/positions/${positionId}/apply`, { method: "POST" });

  if (!res.ok) {
    return { ok: false as const, error: res.error };
  }

  redirect("/dashboard/applications");
}
