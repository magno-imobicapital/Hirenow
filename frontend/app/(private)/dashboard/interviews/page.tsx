import Link from "next/link";
import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { Interview } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function InterviewsPage() {
  const res = await api<Interview[]>("/interviews");

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar entrevistas.</p>
      </div>
    );
  }

  const now = Date.now();
  const interviews = res.data;
  const upcoming = interviews.filter(
    (i) => new Date(i.scheduledAt).getTime() >= now,
  );
  const past = interviews.filter(
    (i) => new Date(i.scheduledAt).getTime() < now,
  );

  return (
    <div>
      <PageHeader
        pageName="Sua Conta"
        pageTitle="Minhas Entrevistas"
        pageDescription="Acompanhe suas próximas entrevistas e acesse os links de reunião."
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-secondary-dark">Próximas</h2>
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Você não tem entrevistas agendadas.
              </p>
            </div>
          ) : (
            upcoming.map((i) => (
              <InterviewCard key={i.id} interview={i} upcoming />
            ))
          )}
        </section>

        {past.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-secondary-dark">Anteriores</h2>
            {past.map((i) => (
              <InterviewCard key={i.id} interview={i} upcoming={false} />
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );

  function InterviewCard({
    interview,
    upcoming,
  }: {
    interview: Interview;
    upcoming: boolean;
  }) {
    return (
      <article
        className={`flex flex-col gap-3 rounded-xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between ${
          upcoming ? "bg-primary/5" : "bg-muted/40"
        }`}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {formatDateTime(interview.scheduledAt)}
          </span>
          <h3 className="text-base font-bold text-secondary-dark">
            {interview.title}
          </h3>
          <Link
            href={`/dashboard/positions/${interview.application.position.id}`}
            className="text-xs text-muted-foreground hover:text-primary hover:underline"
          >
            {interview.application.position.title}
          </Link>
        </div>

        {interview.meetingUrl && upcoming ? (
          <a
            href={interview.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            Entrar na reunião →
          </a>
        ) : interview.meetingUrl ? (
          <a
            href={interview.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-muted-foreground hover:underline whitespace-nowrap"
          >
            Link da reunião
          </a>
        ) : null}
      </article>
    );
  }
}
