import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate, formatSalary } from "@/lib/format";
import { Pagination } from "@/components/pagination";

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

const PAGE_LIMIT = 9;

const EMPLOYMENT_TYPES = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Estágio" },
  { value: "TEMPORARY", label: "Temporário" },
];

export default async function PositionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    employmentType?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search?.trim() || "";
  const employmentType = params.employmentType || "";

  const apiQuery = new URLSearchParams();
  apiQuery.set("page", String(page));
  apiQuery.set("limit", String(PAGE_LIMIT));
  if (search) apiQuery.set("search", search);
  if (employmentType) apiQuery.set("employmentType", employmentType);

  const res = await api<PositionsPage>(`/positions?${apiQuery}`);

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
        <div
          className="absolute inset-0 opacity-[0.04]"
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
        {/* Filtros */}
        <form
          method="get"
          action="/positions"
          className="mb-10 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Buscar por título ou descrição..."
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3.5 text-secondary outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <select
            name="employmentType"
            defaultValue={employmentType}
            className="rounded-xl border border-border bg-background px-4 py-3.5 text-secondary outline-none transition-all duration-200 hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-56"
          >
            <option value="">Todos os modelos</option>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            Filtrar
          </button>
        </form>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-secondary text-lg">
              Nenhuma vaga disponível no momento.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => {
              const salary = formatSalary(p);
              return (
                <li
                  key={p.id}
                  className="group rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col"
                >
                  <article className="p-6 flex flex-col h-full">
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

                    <p className="text-muted-foreground text-[0.9rem] leading-relaxed line-clamp-3 mb-5 flex-1">
                      {p.description}
                    </p>

                    <Link
                      href={`/positions/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors mt-auto"
                    >
                      Ver vaga
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/positions"
          query={{
            ...(search && { search }),
            ...(employmentType && { employmentType }),
          }}
        />
      </section>
    </div>
  );
}
