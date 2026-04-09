import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type Document = {
  id: string;
  status: string;
  contractSignedAt: string | null;
  recruiterContractUrl: string | null;
  recruiterResumeUrl: string | null;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    profile: { fullName: string | null } | null;
  };
  position: {
    id: string;
    title: string;
  };
};

export default async function RecruiterDocumentsPage() {
  const res = await api<Document[]>("/applications/documents");
  const docs = res.ok ? res.data : [];

  return (
    <div>
      <PageHeader
        pageName="Painel do Recrutador"
        pageTitle="Documentos"
        pageDescription="Contratos e currículos dos candidatos contratados."
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12">
        {docs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum documento disponível ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {docs.map((d) => {
              const name = d.user.profile?.fullName ?? d.user.email;
              const signed = Boolean(d.contractSignedAt);
              return (
                <article
                  key={d.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-primary/5 p-5"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-secondary-dark truncate">
                        {name}
                      </h3>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          signed
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {signed ? "Assinado" : "Pendente"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {d.position.title}
                    </p>
                    {name !== d.user.email ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {d.user.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    {d.recruiterContractUrl ? (
                      <a
                        href={d.recruiterContractUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-xs font-medium text-secondary-dark hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-100 text-green-700">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-semibold">Contrato</span>
                          <span className="text-[10px] text-muted-foreground">HTML</span>
                        </div>
                      </a>
                    ) : null}

                    {d.recruiterResumeUrl ? (
                      <a
                        href={d.recruiterResumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-xs font-medium text-secondary-dark hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-semibold">Currículo</span>
                          <span className="text-[10px] text-muted-foreground">PDF</span>
                        </div>
                      </a>
                    ) : null}

                    {!d.recruiterContractUrl && !d.recruiterResumeUrl ? (
                      <p className="text-xs italic text-muted-foreground">
                        Aguardando assinatura do contrato.
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
