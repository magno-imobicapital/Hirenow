import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { UserStats, PositionsStats } from "@/lib/types";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-primary/5 px-5 py-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <p
        className={`mt-1 text-2xl font-extrabold ${
          highlight ? "text-primary" : "text-secondary-dark"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboard() {
  const [usersRes, positionsRes] = await Promise.all([
    api<UserStats>("/users/stats"),
    api<PositionsStats>("/positions/stats"),
  ]);

  const users = usersRes.ok ? usersRes.data : null;
  const positions = positionsRes.ok ? positionsRes.data : null;

  return (
    <div>
      <PageHeader
        pageName="Administração"
        pageTitle="Dashboard"
        pageDescription="Visão geral da plataforma."
        actionButton={{ label: "Gerenciar usuários", href: "/admin/users" }}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-secondary-dark">Usuários</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total" value={users?.total ?? 0} />
            <StatCard label="Candidatos" value={users?.candidates ?? 0} />
            <StatCard label="Recrutadores" value={users?.recruiters ?? 0} />
            <StatCard label="Administradores" value={users?.admins ?? 0} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-secondary-dark">
            Vagas e candidaturas
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Vagas abertas"
              value={positions?.openPositions ?? 0}
            />
            <StatCard
              label="Total de vagas"
              value={positions?.totalPositions ?? 0}
            />
            <StatCard
              label="Total de candidaturas"
              value={positions?.totalCandidates ?? 0}
            />
            <StatCard
              label="Novos esta semana"
              value={`+${positions?.newCandidatesThisWeek ?? 0}`}
              highlight
            />
          </div>
        </section>
      </div>
    </div>
  );
}
