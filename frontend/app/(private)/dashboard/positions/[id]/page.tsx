import Link from "next/link";
import PageHeader from "@/components/page-header";
import { api } from "@/lib/api";
import { formatDate, formatSalary } from "@/lib/format";
import ApplyButton from "@/app/(public)/positions/[id]/_components/apply-button";

type Position = {
  id: string;
  title: string;
  description: string;
  employmentType: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  isActive: boolean;
  createdAt: string;
};

export default async function CandidatePositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await api<Position>(`/positions/${id}`);

  if (!res.ok) {
    return (
      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto mt-8">
        <p className="text-secondary mb-4">Vaga não encontrada.</p>
        <Link href="/dashboard/positions" className="text-primary hover:underline">
          ← Voltar para vagas
        </Link>
      </div>
    );
  }

  const position = res.data;
  const salary = formatSalary(position);

  return (
    <div>
      <PageHeader
        pageName="Vaga"
        pageTitle={position.title}
        pageDescription={`${position.location} • Publicada em ${formatDate(position.createdAt)}`}
        actionSlot={<ApplyButton positionId={position.id} />}
      />

      <div className="max-w-[1500px] px-12 lg:px-16 mx-auto pb-12 flex flex-col gap-6">
        <Link
          href="/dashboard/positions"
          className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
        >
          ← Todas as vagas
        </Link>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {position.employmentType}
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-dark">
            {position.location}
          </span>
          {salary ? (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {salary}
            </span>
          ) : null}
        </div>

        <article className="whitespace-pre-wrap rounded-xl border border-border bg-primary/5 p-6 text-sm leading-relaxed text-secondary">
          {position.description}
        </article>
      </div>
    </div>
  );
}
