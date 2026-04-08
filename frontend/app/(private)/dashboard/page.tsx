import Link from "next/link";
import PageHeader from "@/components/page-header";
import PageStatistics from "@/components/page-statistics";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

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
  position: {
    id: string;
    title: string;
    employmentType: string;
    location: string;
  };
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pendente",
  REVIEWING: "Em análise",
  INTERVIEW: "Entrevista",
  TECHNICAL_INTERVIEW: "Entrevista técnica",
  WITHDRAWN: "Desistente",
  HIRED: "Contratado",
  REJECTED: "Reprovado",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  REVIEWING: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  TECHNICAL_INTERVIEW: "bg-purple-100 text-purple-700",
  WITHDRAWN: "bg-red-100 text-red-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-orange-100 text-orange-700",
};

const ACTIVE_STATUSES: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "INTERVIEW",
  "TECHNICAL_INTERVIEW",
];

type Profile = { fullName: string | null };

type Interview = {
  id: string;
  title: string;
  meetingUrl: string | null;
  scheduledAt: string;
  application: {
    id: string;
    position: { id: string; title: string };
  };
};

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function CandidateDashboard() {
  const [res, profileRes, interviewsRes] = await Promise.all([
    api<Application[]>("/applications"),
    api<Profile>("/profile"),
    api<Interview[]>("/interviews"),
  ]);
  const applications = res.ok ? res.data : [];
  const firstName = profileRes.ok && profileRes.data?.fullName
    ? profileRes.data.fullName.trim().split(/\s+/)[0]
    : null;

  const total = applications.length;
  const active = applications.filter((a) =>
    ACTIVE_STATUSES.includes(a.status),
  ).length;
  const inInterview = applications.filter(
    (a) => a.status === "INTERVIEW" || a.status === "TECHNICAL_INTERVIEW",
  ).length;
  const hired = applications.filter((a) => a.status === "HIRED").length;

  const now = Date.now();
  const upcomingInterviews = (interviewsRes.ok ? interviewsRes.data : [])
    .filter((i) => new Date(i.scheduledAt).getTime() >= now)
    .slice(0, 3);

  const recent = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        pageName="Sua Conta"
        pageTitle={`Olá, ${firstName ?? "candidato"}`}
        pageDescription="Veja um resumo das suas candidaturas e descubra novas oportunidades."
        actionButton={{
          label: "Ver vagas",
          href: "/dashboard/positions",
        }}
      />

      <PageStatistics
        statistics={[
          { label: "Candidaturas ativas", value: active },
          { label: "Em entrevista", value: inInterview, highlight: true },
          { label: "Contratado", value: hired },
          { label: "Total", value: total },
        ]}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary-dark">
            Próximas entrevistas
          </h2>
          {upcomingInterviews.length > 0 ? (
            <Link
              href="/dashboard/interviews"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver todas →
            </Link>
          ) : null}
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Você não tem entrevistas agendadas.
            </p>
          </div>
        ) : (
          upcomingInterviews.map((i) => (
            <article
              key={i.id}
              className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  {formatDateTime(i.scheduledAt)}
                </span>
                <h3 className="text-base font-bold text-secondary-dark">
                  {i.title}
                </h3>
                <Link
                  href={`/dashboard/positions/${i.application.position.id}`}
                  className="text-xs text-muted-foreground hover:text-primary hover:underline"
                >
                  {i.application.position.title}
                </Link>
              </div>
              {i.meetingUrl ? (
                <a
                  href={i.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                  Entrar na reunião →
                </a>
              ) : null}
            </article>
          ))
        )}
      </div>

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12 mt-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary-dark">
            Candidaturas recentes
          </h2>
          {applications.length > 0 ? (
            <Link
              href="/dashboard/applications"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver todas →
            </Link>
          ) : null}
        </div>

        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não se candidatou a nenhuma vaga.
            </p>
            <Link
              href="/dashboard/positions"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Ver vagas abertas →
            </Link>
          </div>
        ) : (
          recent.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/positions/${app.position.id}`}
              className="flex flex-col gap-2 rounded-xl border border-border bg-primary/5 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[app.status]}`}
                  >
                    {STATUS_LABELS[app.status]}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-dark">
                    {app.position.employmentType}
                  </span>
                </div>
                <h3 className="text-base font-bold text-secondary-dark">
                  {app.position.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {app.position.location} • Candidatou-se em{" "}
                  {formatDate(app.createdAt)}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary">
                Ver vaga →
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
