import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type HiredApplication = {
  id: string;
  createdAt: string;
  updatedAt: string;
  adminContractUrl: string | null;
  adminResumeUrl: string | null;
  user: {
    id: string;
    email: string;
    profile: { fullName: string | null } | null;
  };
  position: {
    id: string;
    title: string;
    employmentType: string;
  };
};

export default async function AdminHiredPage() {
  const res = await api<HiredApplication[]>("/applications/hired");

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar contratados.</p>
      </div>
    );
  }

  const hired = res.data;

  return (
    <div>
      <PageHeader
        pageName="Administração"
        pageTitle="Contratados"
        pageDescription="Contratos e currículos dos candidatos contratados."
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12">
        {hired.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum candidato contratado ainda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Candidato</th>
                  <th className="px-4 py-3">Vaga</th>
                  <th className="px-4 py-3">Contratado em</th>
                  <th className="px-4 py-3">Documentos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hired.map((h) => (
                  <tr key={h.id} className="bg-background hover:bg-primary/5">
                    <td className="px-4 py-3">
                      <p className="font-medium text-secondary-dark">
                        {h.user.profile?.fullName ?? h.user.email}
                      </p>
                      {h.user.profile?.fullName ? (
                        <p className="text-xs text-muted-foreground">
                          {h.user.email}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-secondary-dark">
                        {h.position.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {h.position.employmentType}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(h.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {h.adminContractUrl ? (
                          <a
                            href={h.adminContractUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800 hover:bg-green-200 transition-colors"
                          >
                            Contrato
                          </a>
                        ) : (
                          <span className="text-[11px] italic text-muted-foreground">
                            Sem contrato
                          </span>
                        )}
                        {h.adminResumeUrl ? (
                          <a
                            href={h.adminResumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:bg-blue-200 transition-colors"
                          >
                            Currículo
                          </a>
                        ) : (
                          <span className="text-[11px] italic text-muted-foreground">
                            Sem currículo
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
