type PositionsEmptyStateProps = {
  filtered: boolean;
};

export default function PositionsEmptyState({ filtered }: PositionsEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-primary/5 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-secondary-dark">
        {filtered ? "Nenhuma vaga encontrada" : "Você ainda não tem vagas"}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {filtered
          ? "Tente ajustar a busca ou remover os filtros para ver mais resultados."
          : "Crie sua primeira vaga clicando em “+ Nova vaga” no topo da página."}
      </p>
    </div>
  );
}
