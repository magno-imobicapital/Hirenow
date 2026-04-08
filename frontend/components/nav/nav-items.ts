import {
  Squares2X2Icon,
  BriefcaseIcon,
  UsersIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import type { UserRole } from "@/lib/auth-cookie";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Squares2X2Icon },
  { label: "Usuários", href: "/admin/usuarios", icon: UsersIcon },
  { label: "Empresas", href: "/admin/empresas", icon: BuildingOffice2Icon },
  { label: "Vagas", href: "/admin/positions", icon: BriefcaseIcon },
  { label: "Relatórios", href: "/admin/relatorios", icon: ChartBarIcon },
  { label: "Configurações", href: "/admin/configuracoes", icon: Cog6ToothIcon },
];

const RECRUITER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/recruiter/dashboard", icon: Squares2X2Icon },
  { label: "Vagas", href: "/recruiter/positions", icon: BriefcaseIcon },
  { label: "Candidatos", href: "/recruiter/candidatos", icon: UsersIcon },
  { label: "Configurações", href: "/recruiter/configuracoes", icon: Cog6ToothIcon },
];

const CANDIDATE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { label: "Vagas", href: "/dashboard/positions", icon: BriefcaseIcon },
  { label: "Candidaturas", href: "/dashboard/applications", icon: ClipboardDocumentListIcon },
  { label: "Entrevistas", href: "/dashboard/interviews", icon: CalendarDaysIcon },
  { label: "Perfil", href: "/profile", icon: UserCircleIcon },
];

export function getNavItems(role: UserRole | null | undefined): NavItem[] {
  switch (role) {
    case "ADMIN":
      return ADMIN_NAV;
    case "RECRUITER":
      return RECRUITER_NAV;
    case "CANDIDATE":
      return CANDIDATE_NAV;
    default:
      return [];
  }
}
