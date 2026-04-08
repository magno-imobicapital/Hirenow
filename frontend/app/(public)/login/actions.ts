"use server";

import { redirect } from "next/navigation";
import { decodeAuthToken, setAuthCookie } from "@/lib/auth-cookie";
import { api } from "@/lib/api";

const REDIRECT_BY_ROLE = {
  CANDIDATE: "/dashboard",
  RECRUITER: "/recruiter/dashboard",
  ADMIN: "/admin/dashboard",
} as const;

export async function loginAction(
  email: string,
  password: string,
  from?: string,
): Promise<{ error: string[] } | void> {
  const response = await api<{ acessToken: string }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (!response.ok) {
    return { error: response.error };
  }

  const { role } = decodeAuthToken(response.data.acessToken);

  await setAuthCookie(response.data.acessToken);

  const target =
    from && from.startsWith("/") && !from.startsWith("//")
      ? from
      : REDIRECT_BY_ROLE[role];

  redirect(target);
}
