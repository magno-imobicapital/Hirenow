"use server";

import { getAuthCookie } from "@/lib/auth-cookie";

export async function downloadPositionsXlsxAction() {
  const token = await getAuthCookie();
  const response = await fetch(`${process.env.API_URL}/positions/export.xlsx`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    return { ok: false as const, error: ["Falha ao gerar relatório"] };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return { ok: true as const, base64: buffer.toString("base64") };
}
