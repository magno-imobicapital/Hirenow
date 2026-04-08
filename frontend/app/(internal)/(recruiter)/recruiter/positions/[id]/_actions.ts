"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function updateApplicationStatusAction(
  applicationId: string,
  status: string,
  positionId: string,
) {
  const res = await api(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: { status },
  });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath(`/recruiter/positions/${positionId}`);
  return { ok: true as const };
}
