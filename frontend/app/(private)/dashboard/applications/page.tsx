import Link from "next/link";
import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "TECHNICAL_INTERVIEW"
  | "WITHDRAWN"
  | "HIRED";

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
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  REVIEWING: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  TECHNICAL_INTERVIEW: "bg-purple-100 text-purple-700",
  WITHDRAWN: "bg-red-100 text-red-700",
  HIRED: "bg-green-100 text-green-700",
};

export default async function ApplicationsPage() {
  const res = await api<Application[]>("/applications");

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar candidaturas.</p>
      </div>
    );
  }

  const applications = res.data;

  return (
    <div>
      <PageHeader
        pageName="Sua Conta"
        pageTitle="Minhas Candidaturas"
        pageDescription="Acompanhe o status das vagas para as quais você se candidatou."
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12 flex flex-col gap-4">
        {applications.length === 0 ? (
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
          applications.map((app) => (
            <article
              key={app.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-2">
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

              <Link
                href={`/dashboard/positions/${app.position.id}`}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold text-secondary hover:bg-muted transition-colors whitespace-nowrap"
              >
                Ver vaga
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
