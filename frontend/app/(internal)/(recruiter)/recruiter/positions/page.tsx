import PageHeader from "@/components/page-header";
import PageStatistics from "@/components/page-statistics";
import { Pagination } from "@/components/pagination";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import PositionCard from "./_components/position-card";
import PositionsFilters from "./_components/positions-filters";

type ManagedPosition = {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: { id: string; email: string };
  _count: { applications: number };
};

type ManagedPositionsPage = {
  items: ManagedPosition[];
  total: number;
  page: number;
  limit: number;
};

type PositionsStats = {
  openPositions: number;
  totalPositions: number;
  totalCandidates: number;
  newCandidatesThisWeek: number;
};

const PAGE_LIMIT = 9;

export default async function RecruiterPositions({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    employmentType?: string;
    mine?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search?.trim() || "";
  const employmentType = params.employmentType || "";
  const mine = params.mine === "true";

  const apiQuery = new URLSearchParams();
  apiQuery.set("page", String(page));
  apiQuery.set("limit", String(PAGE_LIMIT));
  if (search) apiQuery.set("search", search);
  if (employmentType) apiQuery.set("employmentType", employmentType);
  if (mine) apiQuery.set("mine", "true");

  const [res, statsRes] = await Promise.all([
    api<ManagedPositionsPage>(`/positions/manage?${apiQuery}`),
    api<PositionsStats>("/positions/stats"),
  ]);

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar vagas.</p>
      </div>
    );
  }

  const { items, total, limit } = res.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const stats = statsRes.ok ? statsRes.data : null;

  return (
    <div>
      <PageHeader
        pageName="Painel do Recrutador"
        pageTitle="Suas Vagas"
        pageDescription="Gerencie posições abertas, acompanhe o pipeline de candidatos e mantenha tudo em movimento."
        actionButton={{
          label: "+ Nova vaga",
          href: "/recruiter/positions/new",
        }}
      />
      <PageStatistics
        statistics={[
          { label: "Vagas abertas", value: stats?.openPositions ?? 0 },
          { label: "Total de vagas", value: stats?.totalPositions ?? total },
          { label: "Total de candidatos", value: stats?.totalCandidates ?? 0 },
          {
            label: "Novos esta semana",
            value: `+${stats?.newCandidatesThisWeek ?? 0}`,
            highlight: true,
          },
        ]}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8 mb-8">
        <PositionsFilters
          search={search}
          employmentType={employmentType}
          mine={mine}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma vaga encontrada.</p>
          ) : (
            items.map((p) => (
              <PositionCard
                key={p.id}
                title={p.title}
                location={p.location}
                contractType={p.employmentType}
                candidatesCount={p._count.applications}
                status={p.isActive ? "open" : "closed"}
                publishedAt={formatDate(p.createdAt)}
              />
            ))
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/recruiter/positions"
          query={{
            ...(search && { search }),
            ...(employmentType && { employmentType }),
            ...(mine && { mine: "true" }),
          }}
        />
      </div>
    </div>
  );
}
