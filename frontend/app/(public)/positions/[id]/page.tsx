import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate, formatSalary } from "@/lib/format";

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

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await api<Position>(`/positions/${id}`);

  if (!res.ok) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary mb-4">Vaga não encontrada.</p>
          <Link href="/positions" className="text-primary hover:underline">
            ← Voltar para vagas
          </Link>
        </div>
      </div>
    );
  }

  const position = res.data;
  const salary = formatSalary(position);

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <Link href="/positions">
            <img src="/images/logo.png" alt="Hireme" className="h-6 w-auto" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <Link
          href="/positions"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary hover:underline mb-6"
        >
          ← Todas as vagas
        </Link>

        <h1 className="text-4xl font-extrabold tracking-tight text-secondary-dark sm:text-5xl">
          {position.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {position.employmentType}
          </span>
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-secondary">
            {position.location}
          </span>
          {salary ? (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
              {salary}
            </span>
          ) : null}
          <span className="text-xs text-muted-foreground">
            Publicada em {formatDate(position.createdAt)}
          </span>
        </div>

        <article className="mt-10 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-secondary">
          {position.description}
        </article>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 border-t border-border pt-8">
          <Link
            href={`/login?from=/positions/${position.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            Candidatar-se
          </Link>
          <Link
            href="/positions"
            className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3.5 text-sm font-semibold text-secondary hover:border-primary/40 hover:text-primary transition-colors"
          >
            Ver outras vagas
          </Link>
        </div>
      </main>
    </div>
  );
}
