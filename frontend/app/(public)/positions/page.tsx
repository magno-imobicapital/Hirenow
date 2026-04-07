import Link from "next/link";
import { api } from "@/lib/api";

type Position = {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  createdAt: string;
};

type PositionsPage = {
  items: Position[];
  total: number;
  page: number;
  limit: number;
};

const PAGE_LIMIT = 10;

function formatSalary(p: Position) {
  if (p.salaryMin == null && p.salaryMax == null) return null;
  const currency = p.currency ?? "BRL";
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  if (p.salaryMin != null && p.salaryMax != null)
    return `${fmt(p.salaryMin)} – ${fmt(p.salaryMax)}`;
  if (p.salaryMin != null) return `A partir de ${fmt(p.salaryMin)}`;
  return `Até ${fmt(p.salaryMax!)}`;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function PositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const res = await api<PositionsPage>(
    `/positions?page=${page}&limit=${PAGE_LIMIT}`,
  );

  if (!res.ok) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-6">
        <p className="text-secondary">Erro ao carregar vagas.</p>
      </div>
    );
  }

  const { items, total, limit } = res.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div
      className="min-h-dvh bg-background"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap"
      />

      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Link href="/">
            <img src="/images/logo.png" alt="Hireme" className="h-6 w-auto" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            "linear-gradient(145deg, #0296D8 0%, #0178AD 50%, #242E35 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.15em] mb-4">
            Vagas em destaque
          </p>
          <h1
            className="text-white text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight max-w-3xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Encontre a oportunidade certa pra você.
          </h1>
          <p className="mt-5 text-white/70 text-base max-w-xl leading-relaxed">
            Explore as vagas abertas, descubra o que combina com seu perfil e
            candidate-se em poucos cliques.
          </p>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/80 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {total} {total === 1 ? "vaga aberta" : "vagas abertas"} agora
          </p>
        </div>
      </section>

      {/* Lista */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-14">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-secondary text-lg">
              Nenhuma vaga disponível no momento.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((p) => {
              const salary = formatSalary(p);
              return (
                <li
                  key={p.id}
                  className="group rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                >
                  <article className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2
                        className="text-secondary-dark text-xl sm:text-[1.4rem] font-semibold leading-tight tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {p.title}
                      </h2>
                      <span className="shrink-0 text-xs font-medium text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {p.employmentType}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-secondary">
                        {p.location}
                      </span>
                      {salary && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                          {salary}
                        </span>
                      )}
                    </div>

                    <p className="text-muted-foreground text-[0.95rem] leading-relaxed line-clamp-3 mb-5">
                      {p.description}
                    </p>

                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Candidatar-se
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-0.5 transition-transform"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const active = n === page;
              return (
                <Link
                  key={n}
                  href={`/positions?page=${n}`}
                  className={
                    active
                      ? "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20"
                      : "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl border border-border text-sm font-medium text-secondary hover:border-primary/40 hover:text-primary transition-colors"
                  }
                >
                  {n}
                </Link>
              );
            })}
          </nav>
        )}
      </section>
    </div>
  );
}
