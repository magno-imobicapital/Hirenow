"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { getAuthCookie } from "@/lib/auth-cookie";

export type ProfileInput = {
  fullName: string;
  birthDate?: string;
  about?: string;
  mobilePhone?: string;
  landlinePhone?: string;
  salaryExpectation?: number;
};

export async function saveProfileAction(
  input: ProfileInput,
  exists: boolean,
) {
  const res = await api("/profile", {
    method: exists ? "PATCH" : "POST",
    body: input,
  });

  if (!res.ok) return { ok: false as const, error: res.error };
  revalidatePath("/profile");
  return { ok: true as const };
}

export async function uploadResumeAction(formData: FormData) {
  const token = await getAuthCookie();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false as const, error: ["Arquivo inválido"] };
  }

  const upstream = new FormData();
  upstream.append("file", file);

  const response = await fetch(`${process.env.API_URL}/profile/resume`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: upstream,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = body?.message ?? ["Falha ao enviar currículo"];
    return {
      ok: false as const,
      error: Array.isArray(error) ? error : [error],
    };
  }

  revalidatePath("/profile");
  return { ok: true as const, resumeUrl: body?.data?.resumeUrl as string };
}
