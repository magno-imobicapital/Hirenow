"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export type CreateInternalUserInput = {
  email: string;
  password: string;
  role: "ADMIN" | "RECRUITER";
};

export async function createInternalUserAction(input: CreateInternalUserInput) {
  const res = await api("/users", { method: "POST", body: input });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function deactivateUserAction(id: string) {
  const res = await api(`/users/${id}/deactivate`, { method: "PATCH" });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function activateUserAction(id: string) {
  const res = await api(`/users/${id}/activate`, { method: "PATCH" });
  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath("/admin/users");
  return { ok: true as const };
}
