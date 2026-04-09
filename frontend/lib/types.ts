// ── Status ──

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "TECHNICAL_INTERVIEW"
  | "WITHDRAWN"
  | "HIRED"
  | "REJECTED";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pendente",
  REVIEWING: "Em análise",
  INTERVIEW: "Entrevista",
  TECHNICAL_INTERVIEW: "Entrevista técnica",
  WITHDRAWN: "Desistente",
  HIRED: "Contratado",
  REJECTED: "Reprovado",
};

export const STATUS_LABELS_PLURAL: Record<ApplicationStatus, string> = {
  PENDING: "Pendentes",
  REVIEWING: "Em análise",
  INTERVIEW: "Entrevista",
  TECHNICAL_INTERVIEW: "Entrevista técnica",
  WITHDRAWN: "Desistentes",
  HIRED: "Contratados",
  REJECTED: "Reprovados",
};

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  REVIEWING: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  TECHNICAL_INTERVIEW: "bg-purple-100 text-purple-700",
  WITHDRAWN: "bg-red-100 text-red-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-orange-100 text-orange-700",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: "bg-slate-400",
  REVIEWING: "bg-blue-500",
  INTERVIEW: "bg-amber-500",
  TECHNICAL_INTERVIEW: "bg-purple-500",
  HIRED: "bg-green-500",
  REJECTED: "bg-orange-500",
  WITHDRAWN: "bg-red-500",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "INTERVIEW",
  "TECHNICAL_INTERVIEW",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
];

export const TERMINAL_STATUSES = new Set<ApplicationStatus>([
  "WITHDRAWN",
  "HIRED",
  "REJECTED",
]);

// ── Positions ──

export type Position = {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  isActive?: boolean;
  createdAt: string;
};

export type ManagedPosition = Position & {
  isActive: boolean;
  createdBy: { id: string; email: string };
  _count: { applications: number };
  newApplicationsCount: number;
};

export type ManagedPositionsPage = {
  items: ManagedPosition[];
  total: number;
  page: number;
  limit: number;
};

export type PositionsStats = {
  openPositions: number;
  totalPositions: number;
  totalCandidates: number;
  newCandidatesThisWeek: number;
};

// ── Profile ──

export type CandidateProfile = {
  fullName: string | null;
  about: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  salaryExpectation: number | string | null;
  resumeUrl: string | null;
};

export type Profile = {
  id: string;
  fullName: string | null;
  birthDate: string | null;
  about: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  salaryExpectation: number | string | null;
  resumeUrl: string | null;
};

// ── Applications ──

export type Application = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  contractToken?: string | null;
  contractSignedAt?: string | null;
  position: {
    id: string;
    title: string;
    employmentType: string;
    location: string;
  };
};

export type PipelineApplication = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  recruiterContractUrl: string | null;
  recruiterResumeUrl: string | null;
  user: {
    id: string;
    email: string;
    profile: CandidateProfile | null;
  };
};

// ── Interviews ──

export type Interview = {
  id: string;
  title: string;
  meetingUrl: string | null;
  scheduledAt: string;
  application: {
    id: string;
    position: { id: string; title: string };
  };
};

export type NextInterview = {
  id: string;
  title: string;
  scheduledAt: string;
  meetingUrl: string | null;
  application: {
    id: string;
    user: {
      email: string;
      profile: { fullName: string | null } | null;
    };
  };
};

// ── Pipeline ──

export type PipelineResponse = {
  position: { id: string; title: string };
  total: number;
  groups: Partial<Record<ApplicationStatus, PipelineApplication[]>>;
  nextInterview: NextInterview | null;
};

// ── Users (admin) ──

export type User = {
  id: string;
  email: string;
  role: "ADMIN" | "RECRUITER" | "CANDIDATE";
  isActive: boolean;
  createdAt: string;
};

export type UserStats = {
  total: number;
  candidates: number;
  recruiters: number;
  admins: number;
};
