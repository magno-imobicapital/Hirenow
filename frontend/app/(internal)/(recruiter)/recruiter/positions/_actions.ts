"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export type CreatePositionInput = {
  title: string;
  description: string;
  employmentType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  isActive: boolean;
};

export async function createPositionAction(input: CreatePositionInput) {
  const res = await api("/positions", {
    method: "POST",
    body: input,
  });

  if (!res.ok) {
    return { ok: false as const, error: res.error };
  }

  revalidatePath("/recruiter/positions");
  return { ok: true as const };
}

export type UpdatePositionInput = Omit<CreatePositionInput, "isActive">;

export async function togglePositionActiveAction(
  id: string,
  isActive: boolean,
) {
  const res = await api(`/positions/${id}/status`, {
    method: "PATCH",
    body: { isActive },
  });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath("/recruiter/positions");
  return { ok: true as const };
}

export async function updatePositionAction(
  id: string,
  input: UpdatePositionInput,
) {
  const res = await api(`/positions/${id}`, {
    method: "PATCH",
    body: input,
  });

  if (!res.ok) {
    return { ok: false as const, error: res.error };
  }

  revalidatePath("/recruiter/positions");
  return { ok: true as const };
}
