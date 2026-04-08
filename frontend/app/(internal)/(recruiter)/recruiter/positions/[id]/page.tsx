import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import StatusSelect from "./_components/status-select";
import CandidateProfileButton from "./_components/candidate-profile-button";
import ScheduleInterviewButton from "./_components/schedule-interview-button";

type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "TECHNICAL_INTERVIEW"
  | "WITHDRAWN"
  | "HIRED"
  | "REJECTED";

type CandidateProfile = {
  fullName: string | null;
  about: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  salaryExpectation: number | string | null;
  resumeUrl: string | null;
};

type PipelineApplication = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    profile: CandidateProfile | null;
  };
};

type PipelineResponse = {
  position: { id: string; title: string };
  total: number;
  groups: Partial<Record<ApplicationStatus, PipelineApplication[]>>;
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
  PENDING: "bg-slate-100 text-slate-700",
  REVIEWING: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  TECHNICAL_INTERVIEW: "bg-purple-100 text-purple-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-orange-100 text-orange-700",
  WITHDRAWN: "bg-red-100 text-red-700",
};

export default async function PositionPipelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await api<PipelineResponse>(`/positions/${id}/applications`);

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar pipeline.</p>
      </div>
    );
  }

  const { position, total, groups } = res.data;

  return (
    <div className="max-w-[1500px] px-12 lg:px-16 mx-auto py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/recruiter/positions"
          className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
        >
          ← Voltar para vagas
        </Link>
        <h1 className="text-3xl font-extrabold text-secondary-dark sm:text-4xl">
          {position.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "candidato" : "candidatos"} no pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STATUS_ORDER.map((status) => {
          const apps = groups[status] ?? [];
          return (
            <section
              key={status}
              className="flex flex-col gap-3 rounded-xl border border-border bg-primary/5 p-4"
            >
              <header className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_COLORS[status]}`}
                >
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {apps.length}
                </span>
              </header>

              <div className="flex flex-col gap-2">
                {apps.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum candidato.
                  </p>
                ) : (
                  apps.map((app) => (
                    <article
                      key={app.id}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <p className="text-sm font-semibold text-secondary-dark">
                        {app.user.profile?.fullName ?? app.user.email}
                      </p>
                      {app.user.profile?.fullName ? (
                        <p className="text-xs text-muted-foreground">
                          {app.user.email}
                        </p>
                      ) : null}
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Candidatou-se em {formatDate(app.createdAt)}
                      </p>
                      <div className="mt-2 flex flex-col gap-1">
                        <CandidateProfileButton
                          email={app.user.email}
                          profile={app.user.profile}
                        />
                        {(app.status === "INTERVIEW" ||
                          app.status === "TECHNICAL_INTERVIEW") && (
                          <ScheduleInterviewButton
                            applicationId={app.id}
                            positionId={position.id}
                            candidateName={
                              app.user.profile?.fullName ?? app.user.email
                            }
                          />
                        )}
                      </div>
                      <div className="mt-3">
                        <StatusSelect
                          applicationId={app.id}
                          positionId={position.id}
                          currentStatus={app.status}
                        />
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
