"use server";

import { redirect } from "next/navigation";
import { setAuthCookie } from "@/lib/auth-cookie";
import { api } from "@/lib/api";

export async function registerAction(
  email: string,
  password: string,
): Promise<{ error: string } | void> {
  console.log("rodando...");
  const response = await api("/auth/register", {
    method: "POST",
    body: { email, password },
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      error: error.message ?? "Ocorreu um erro! Tente novamente mais tarde.",
    };
  }

  const { acessToken } = await response.json();
  await setAuthCookie(acessToken);

  redirect("/dashboard");
}
