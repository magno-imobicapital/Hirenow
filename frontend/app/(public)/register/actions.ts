"use server";

import { redirect } from "next/navigation";
import { setAuthCookie } from "@/lib/auth-cookie";
import { api } from "@/lib/api";

export async function registerAction(
  email: string,
  password: string,
): Promise<{ error: string[] } | void> {
  const response = await api<{ acessToken: string }>("/auth/register", {
    method: "POST",
    body: { email, password },
  });

  if (!response.ok) {
    return { error: response.error };
  }

  await setAuthCookie(response.data.acessToken);

  redirect("/dashboard");
}
