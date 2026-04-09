import PageHeader from "@/components/page-header";
import PageStatistics from "@/components/page-statistics";
import { api } from "@/lib/api";
import ExportButton from "./_components/export-button";

export const dynamic = "force-dynamic";

type PositionsStats = {
  openPositions: number;
  totalPositions: number;
  totalCandidates: number;
  newCandidatesThisWeek: number;
};

type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "TECHNICAL_INTERVIEW"
  | "WITHDRAWN"
  | "HIRED"
  | "REJECTED";

type Application = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  position: { id: string; title: string };
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pendentes",
  REVIEWING: "Em análise",
  INTERVIEW: "Entrevista",
  TECHNICAL_INTERVIEW: "Entrevista técnica",
  HIRED: "Contratados",
  REJECTED: "Reprovados",
  WITHDRAWN: "Desistentes",
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: "bg-slate-400",
  REVIEWING: "bg-blue-500",
  INTERVIEW: "bg-amber-500",
  TECHNICAL_INTERVIEW: "bg-purple-500",
  HIRED: "bg-green-500",
  REJECTED: "bg-orange-500",
  WITHDRAWN: "bg-red-500",
};

const STATUS_ORDER: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "INTERVIEW",
  "TECHNICAL_INTERVIEW",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
];

export default async function RecruiterDashboard() {
  const [statsRes, applicationsRes] = await Promise.all([
    api<PositionsStats>("/positions/stats"),
    api<Application[]>("/applications/all"),
  ]);

  const stats = statsRes.ok ? statsRes.data : null;
  const statsError = statsRes.ok
    ? null
    : "Não foi possível carregar as estatísticas.";
  const applications = applicationsRes.ok ? applicationsRes.data : [];

  // Distribuição por status
  const byStatus: Record<ApplicationStatus, number> = {
    PENDING: 0,
    REVIEWING: 0,
    INTERVIEW: 0,
    TECHNICAL_INTERVIEW: 0,
    HIRED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };
  for (const app of applications) byStatus[app.status]++;

  const totalApps = applications.length || 1;
  const hiredCount = byStatus.HIRED;
  const rejectedCount = byStatus.REJECTED;
  const withdrawnCount = byStatus.WITHDRAWN;
  const closedCount = hiredCount + rejectedCount + withdrawnCount;
  const hireRate = closedCount > 0 ? (hiredCount / closedCount) * 100 : 0;

  // Top 5 vagas por nº de candidatos
  const countsByPosition = new Map<
    string,
    { id: string; title: string; count: number }
  >();
  for (const app of applications) {
    const existing = countsByPosition.get(app.position.id);
    if (existing) existing.count++;
    else
      countsByPosition.set(app.position.id, {
        id: app.position.id,
        title: app.position.title,
        count: 1,
      });
  }
  const topPositions = [...countsByPosition.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topMax = topPositions[0]?.count ?? 1;

  return (
    <div>
      <PageHeader
        pageName="Painel do Recrutador"
        pageTitle="Dashboard"
        pageDescription="Visão analítica das vagas e candidaturas da empresa."
        actionSlot={<ExportButton />}
      />

      <PageStatistics
        error={statsError}
        statistics={[
          { label: "Vagas abertas", value: stats?.openPositions ?? 0 },
          { label: "Total de vagas", value: stats?.totalPositions ?? 0 },
          { label: "Total de candidatos", value: stats?.totalCandidates ?? 0 },
          {
            label: "Taxa de contratação",
            value: `${hireRate.toFixed(0)}%`,
            highlight: true,
          },
        ]}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8 pb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribuição por status */}
        <section className="rounded-xl border border-border bg-primary/5 p-6 flex flex-col gap-4">
          <header>
            <h2 className="text-base font-bold text-secondary-dark">
              Candidaturas por etapa
            </h2>
            <p className="text-xs text-muted-foreground">
              Distribuição entre todas as candidaturas ({applications.length}).
            </p>
          </header>

          {applications.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">
              Sem candidaturas até o momento.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {STATUS_ORDER.map((status) => {
                const count = byStatus[status];
                const pct = (count / totalApps) * 100;
                return (
                  <div key={status} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-secondary-dark">
                        {STATUS_LABELS[status]}
                      </span>
                      <span className="text-muted-foreground">
                        {count}{" "}
                        <span className="text-[10px]">
                          ({pct.toFixed(0)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className={`h-full ${STATUS_COLORS[status]} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Top vagas por candidatos */}
        <section className="rounded-xl border border-border bg-primary/5 p-6 flex flex-col gap-4">
          <header>
            <h2 className="text-base font-bold text-secondary-dark">
              Top vagas por candidatos
            </h2>
            <p className="text-xs text-muted-foreground">
              As 5 vagas com mais candidaturas recebidas.
            </p>
          </header>

          {topPositions.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">
              Nenhuma candidatura registrada.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topPositions.map((p) => (
                <div key={p.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-semibold text-secondary-dark">
                      {p.title}
                    </span>
                    <span className="text-muted-foreground">{p.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(p.count / topMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resumo de fechamento */}
        <section className="rounded-xl border border-border bg-primary/5 p-6 lg:col-span-2">
          <header className="mb-4">
            <h2 className="text-base font-bold text-secondary-dark">
              Resumo de fechamento
            </h2>
            <p className="text-xs text-muted-foreground">
              Status finais das candidaturas encerradas ({closedCount}).
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Contratados
              </p>
              <p className="mt-1 text-2xl font-extrabold text-green-700">
                {hiredCount}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Reprovados
              </p>
              <p className="mt-1 text-2xl font-extrabold text-orange-700">
                {rejectedCount}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Desistentes
              </p>
              <p className="mt-1 text-2xl font-extrabold text-red-700">
                {withdrawnCount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
