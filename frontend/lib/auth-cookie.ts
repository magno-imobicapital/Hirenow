import { cookies } from "next/headers";

const AUTH_COOKIE = "acessToken";
const MAX_AGE = 60 * 60 * 24 * 7;

export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export function decodeAuthToken(token: string): AuthTokenPayload {
  const payload = token.split(".")[1];
  const decoded = Buffer.from(payload, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
