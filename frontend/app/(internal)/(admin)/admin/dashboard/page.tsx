import PageHeader from "@/components/page-header";
import PageStatistics from "@/components/page-statistics";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type UserStats = {
  total: number;
  candidates: number;
  recruiters: number;
  admins: number;
};

type PositionsStats = {
  openPositions: number;
  totalPositions: number;
  totalCandidates: number;
  newCandidatesThisWeek: number;
};

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

      <PageStatistics
        statistics={[
          { label: "Total de usuários", value: users?.total ?? 0 },
          { label: "Candidatos", value: users?.candidates ?? 0 },
          { label: "Recrutadores", value: users?.recruiters ?? 0 },
          { label: "Administradores", value: users?.admins ?? 0 },
        ]}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-6 pb-12">
        <PageStatistics
          statistics={[
            { label: "Vagas abertas", value: positions?.openPositions ?? 0 },
            { label: "Total de vagas", value: positions?.totalPositions ?? 0 },
            {
              label: "Total de candidaturas",
              value: positions?.totalCandidates ?? 0,
            },
            {
              label: "Novos esta semana",
              value: `+${positions?.newCandidatesThisWeek ?? 0}`,
              highlight: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
