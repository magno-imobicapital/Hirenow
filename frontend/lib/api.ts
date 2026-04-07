import { getAuthCookie } from "./auth-cookie";

type ApiOptions = {
  method: string;
  contentType?: string;
  body?: unknown;
};

export async function api(path: string, options: ApiOptions) {
  const token = await getAuthCookie();

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  headers["Content-Type"] = options.contentType ?? "application/json";

  return fetch(`${process.env.API_URL}${path}`, {
    method: options.method !== undefined ? options.method : "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}
