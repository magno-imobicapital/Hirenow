import Link from "next/link";
import PageHeader from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { api } from "@/lib/api";
import { formatDate, formatSalary } from "@/lib/format";
import { Position } from "@/lib/types";

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

export default async function CandidatePositionsPage({
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
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar vagas.</p>
      </div>
    );
  }

  const { items, total, limit } = res.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <PageHeader
        pageName="Sua Conta"
        pageTitle="Vagas Abertas"
        pageDescription="Explore as oportunidades disponíveis e candidate-se com poucos cliques."
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12">
        <form
          method="get"
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por título ou descrição..."
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-secondary outline-none transition-colors hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <select
            name="employmentType"
            defaultValue={employmentType}
            className="rounded-md border border-border bg-background px-4 py-2.5 text-sm text-secondary outline-none transition-colors hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-52"
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
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Filtrar
          </button>
        </form>

        {items.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma vaga encontrada.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => {
              const salary = formatSalary(p);
              return (
                <li
                  key={p.id}
                  className="flex h-full flex-col gap-4 rounded-xl border border-border bg-primary/5 p-6"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-secondary-dark">
                      {p.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {p.employmentType}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-dark">
                        {p.location}
                      </span>
                      {salary ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          {salary}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className="line-clamp-3 text-xs text-muted-foreground">
                    {p.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </span>
                    <Link
                      href={`/dashboard/positions/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark transition-colors"
                    >
                      Ver vaga →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/dashboard/positions"
          query={{
            ...(search && { search }),
            ...(employmentType && { employmentType }),
          }}
        />
      </div>
    </div>
  );
}
