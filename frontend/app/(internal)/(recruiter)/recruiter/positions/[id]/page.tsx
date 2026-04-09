import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import {
  PipelineResponse,
  STATUS_ORDER,
  STATUS_LABELS_PLURAL,
  STATUS_STYLES,
} from "@/lib/types";
import StatusSelect from "./_components/status-select";
import CandidateProfileButton from "./_components/candidate-profile-button";
import ScheduleInterviewButton from "./_components/schedule-interview-button";

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

  const { position, total, groups, nextInterview } = res.data;
  const nextDate = nextInterview
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(nextInterview.scheduledAt))
    : null;

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

      {nextInterview ? (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Próxima entrevista
            </span>
            <h3 className="text-base font-bold text-secondary-dark">
              {nextInterview.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {nextDate} •{" "}
              {nextInterview.application.user.profile?.fullName ??
                nextInterview.application.user.email}
            </p>
          </div>
          {nextInterview.meetingUrl ? (
            <a
              href={nextInterview.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              Entrar na reunião →
            </a>
          ) : null}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-4 text-xs text-muted-foreground">
          Nenhuma entrevista agendada para esta vaga.
        </section>
      )}

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
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
                >
                  {STATUS_LABELS_PLURAL[status]}
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
                      {app.status === "HIRED" &&
                        (app.recruiterContractUrl ||
                          app.recruiterResumeUrl) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {app.recruiterContractUrl && (
                              <a
                                href={app.recruiterContractUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800 hover:bg-green-200 transition-colors"
                              >
                                Contrato
                              </a>
                            )}
                            {app.recruiterResumeUrl && (
                              <a
                                href={app.recruiterResumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:bg-blue-200 transition-colors"
                              >
                                Currículo
                              </a>
                            )}
                          </div>
                        )}

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
