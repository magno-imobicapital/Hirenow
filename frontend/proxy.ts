import { NextResponse, type NextRequest } from "next/server";

type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

type TokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  exp?: number;
};

const AUTH_COOKIE = "acessToken";

// Rotas públicas (acessíveis sem login). Só prefixos.
const PUBLIC_PATHS = ["/login", "/register", "/positions", "/"];

// Rotas internas por role. Cada entrada: prefixo => roles permitidos.
const ROLE_PREFIXES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/recruiter", roles: ["RECRUITER"] },
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard", roles: ["CANDIDATE"] },
];

function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

function isPublic(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

function defaultHomeForRole(role: UserRole) {
  switch (role) {
    case "RECRUITER":
      return "/recruiter/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    case "CANDIDATE":
      return "/dashboard";
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? decodeToken(token) : null;
  const expired =
    payload?.exp != null && payload.exp * 1000 < Date.now();
  const isAuthed = Boolean(payload && !expired);

  // Token inválido/expirado: limpa cookie.
  if (token && !isAuthed) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(AUTH_COOKIE);
    return res;
  }

  // Logado tentando acessar /login ou /register: manda pra home da role.
  if (isAuthed && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(
      new URL(defaultHomeForRole(payload!.role), request.url),
    );
  }

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Não autenticado em rota privada: pra login.
  if (!isAuthed) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Autenticado: checa se a role tem acesso ao prefixo.
  const match = ROLE_PREFIXES.find((r) => pathname.startsWith(r.prefix));
  if (match && !match.roles.includes(payload!.role)) {
    return NextResponse.redirect(
      new URL(defaultHomeForRole(payload!.role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Todas as rotas exceto assets, api e arquivos estáticos.
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
