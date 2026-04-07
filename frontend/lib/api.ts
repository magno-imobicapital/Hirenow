import { getAuthCookie } from "./auth-cookie";

type ApiOptions = {
  method?: string;
  contentType?: string;
  body?: unknown;
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false, error: string[] };

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<ApiResult<T>> {
  const token = await getAuthCookie();

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers["Content-Type"] = options.contentType ?? "application/json";

  const response = await fetch(`${process.env.API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = body?.message ?? ["Erro na requisição"];
    return { ok: false, error: Array.isArray(error) ? error : [error] };
  }

  return { ok: true, data: body?.data as T };
}
