"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function scheduleInterviewAction(
  applicationId: string,
  positionId: string,
  input: { title: string; scheduledAt: string; meetingUrl?: string },
) {
  const res = await api(`/applications/${applicationId}/interviews`, {
    method: "POST",
    body: input,
  });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath(`/recruiter/positions/${positionId}`);
  return { ok: true as const };
}

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
