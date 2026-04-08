import type { ReactNode } from "react";

type PositionCardProps = {
  title: string;
  location: string;
  contractType: string;
  candidatesCount: number;
  newCandidatesCount?: number;
  status: "open" | "paused" | "closed";
  publishedAt: string;
  onViewPipeline?: () => void;
  editSlot?: ReactNode;
  statusToggleSlot?: ReactNode;
};

const statusLabels: Record<PositionCardProps["status"], string> = {
  open: "Aberta",
  paused: "Pausada",
  closed: "Encerrada",
};

const statusStyles: Record<PositionCardProps["status"], string> = {
  open: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-slate-200 text-slate-700",
};

const statusDot: Record<PositionCardProps["status"], string> = {
  open: "bg-green-500",
  paused: "bg-yellow-500",
  closed: "bg-slate-400",
};

export default function PositionCard({
  title,
  location,
  contractType,
  candidatesCount,
  newCandidatesCount,
  status,
  publishedAt,
  onViewPipeline,
  editSlot,
  statusToggleSlot,
}: PositionCardProps) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-xl border border-border bg-primary/5 p-6 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
            {statusLabels[status]}
            {statusToggleSlot}
          </span>

          <span className="inline-flex items-center rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-dark">
            {contractType}
          </span>

          {newCandidatesCount && newCandidatesCount > 0 ? (
            <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
              +{newCandidatesCount} novos
            </span>
          ) : null}
        </div>

        <h3 className="text-lg font-bold text-secondary-dark">{title}</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Publicada em {publishedAt}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-secondary-dark">
            {candidatesCount}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Candidatos
          </span>
        </div>

        <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onViewPipeline}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          Ver pipeline
          <span aria-hidden>→</span>
        </button>

        {editSlot}

        </div>
      </div>
    </article>
  );
}
