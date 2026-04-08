import Link from "next/link";
import PageHeader from "@/components/page-header";
import PageStatistics from "@/components/page-statistics";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type PositionsStats = {
  openPositions: number;
  totalPositions: number;
  totalCandidates: number;
  newCandidatesThisWeek: number;
};

type ManagedPosition = {
  id: string;
  title: string;
  employmentType: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  _count: { applications: number };
  newApplicationsCount: number;
};

type ManagedPositionsPage = {
  items: ManagedPosition[];
  total: number;
};

export default async function RecruiterDashboard() {
  const [statsRes, positionsRes] = await Promise.all([
    api<PositionsStats>("/positions/stats?mine=true"),
    api<ManagedPositionsPage>("/positions/manage?mine=true&page=1&limit=5"),
  ]);

  const stats = statsRes.ok ? statsRes.data : null;
  const statsError = statsRes.ok
    ? null
    : "Não foi possível carregar as estatísticas.";
  const positions = positionsRes.ok ? positionsRes.data.items : [];

  return (
    <div>
      <PageHeader
        pageName="Painel do Recrutador"
        pageTitle="Dashboard"
        pageDescription="Resumo das suas vagas e candidaturas recentes."
        actionButton={{ label: "Ver vagas", href: "/recruiter/positions" }}
      />

      <PageStatistics
        error={statsError}
        statistics={[
          { label: "Minhas vagas abertas", value: stats?.openPositions ?? 0 },
          { label: "Total de vagas", value: stats?.totalPositions ?? 0 },
          { label: "Total de candidatos", value: stats?.totalCandidates ?? 0 },
          {
            label: "Novos esta semana",
            value: `+${stats?.newCandidatesThisWeek ?? 0}`,
            highlight: true,
          },
        ]}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8 pb-12 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary-dark">
            Vagas recentes
          </h2>
          {positions.length > 0 ? (
            <Link
              href="/recruiter/positions?mine=true"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver todas →
            </Link>
          ) : null}
        </div>

        {positions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não criou nenhuma vaga.
            </p>
            <Link
              href="/recruiter/positions"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Criar vaga →
            </Link>
          </div>
        ) : (
          positions.map((p) => (
            <Link
              key={p.id}
              href={`/recruiter/positions/${p.id}`}
              className="flex flex-col gap-2 rounded-xl border border-border bg-primary/5 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      p.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        p.isActive ? "bg-green-500" : "bg-slate-400"
                      }`}
                    />
                    {p.isActive ? "Aberta" : "Encerrada"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-dark">
                    {p.employmentType}
                  </span>
                  {p.newApplicationsCount > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                      +{p.newApplicationsCount} novos
                    </span>
                  ) : null}
                </div>
                <h3 className="text-base font-bold text-secondary-dark">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {p.location} • Publicada em {formatDate(p.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xl font-extrabold text-secondary-dark">
                    {p._count.applications}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    candidatos
                  </span>
                </div>
                <span className="text-xs font-semibold text-primary">
                  Ver pipeline →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
