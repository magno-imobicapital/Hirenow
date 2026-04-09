import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { User } from "@/lib/types";
import CreateUserButton from "./_components/create-user-button";
import ToggleActiveButton from "./_components/toggle-active-button";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  RECRUITER: "Recrutador",
  CANDIDATE: "Candidato",
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  RECRUITER: "bg-blue-100 text-blue-700",
  CANDIDATE: "bg-slate-100 text-slate-700",
};

const ROLES = [
  { value: "", label: "Todas as roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "RECRUITER", label: "Recrutador" },
  { value: "CANDIDATE", label: "Candidato" },
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; search?: string }>;
}) {
  const params = await searchParams;
  const role = params.role || "";
  const search = params.search?.trim() || "";

  const apiQuery = new URLSearchParams();
  if (role) apiQuery.set("role", role);
  if (search) apiQuery.set("search", search);

  const res = await api<User[]>(`/users?${apiQuery}`);

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary">Erro ao carregar usuários.</p>
      </div>
    );
  }

  const users = res.data;

  return (
    <div>
      <PageHeader
        pageName="Administração"
        pageTitle="Usuários"
        pageDescription="Gerencie todos os usuários da plataforma."
        actionSlot={<CreateUserButton />}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12">
        <form
          method="get"
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por e-mail..."
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-secondary outline-none transition-colors hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <select
            name="role"
            defaultValue={role}
            className="rounded-md border border-border bg-background px-4 py-2.5 text-sm text-secondary outline-none transition-colors hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-52"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Filtrar
          </button>
        </form>

        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-primary/5 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum usuário encontrado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3 text-center">Ativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="bg-background hover:bg-primary/5">
                    <td className="px-4 py-3 font-medium text-secondary-dark">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${ROLE_STYLES[u.role]}`}
                      >
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.role === "RECRUITER" ? (
                        <ToggleActiveButton userId={u.id} isActive={u.isActive} />
                      ) : (
                        <span className={`text-xs ${u.isActive ? "text-green-700" : "text-muted-foreground"}`}>
                          {u.isActive ? "Ativo" : "Inativo"}
                        </span>
                      )}
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
