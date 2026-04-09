import {
  Squares2X2Icon,
  BriefcaseIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  FolderOpenIcon,
  UsersIcon,
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
  { label: "Usuários", href: "/admin/users", icon: UsersIcon },
  { label: "Contratados", href: "/admin/hired", icon: DocumentCheckIcon },
];

const RECRUITER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/recruiter/dashboard", icon: Squares2X2Icon },
  { label: "Vagas", href: "/recruiter/positions", icon: BriefcaseIcon },
  { label: "Documentos", href: "/recruiter/documents", icon: FolderOpenIcon },
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
