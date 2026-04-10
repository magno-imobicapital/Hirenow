import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "acessToken";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  const res = await fetch(`${process.env.API_URL}/positions/${id}/ranking`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      { error: body?.message ?? "Erro ao gerar ranking" },
      { status: res.status },
    );
  }

  const data = body?.data ?? body ?? [];
  const seen = new Set<string>();
  const deduped = Array.isArray(data)
    ? data.filter((r: { applicationId: string }) => {
        if (seen.has(r.applicationId)) return false;
        seen.add(r.applicationId);
        return true;
      })
    : data;

  return NextResponse.json(deduped);
}
