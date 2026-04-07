import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  query,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(query);
    params.set("page", String(page));
    return `${basePath}?${params}`;
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
        const active = n === currentPage;
        return (
          <Link
            key={n}
            href={buildHref(n)}
            className={
              active
                ? "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20"
                : "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-xl border border-border text-sm font-medium text-secondary hover:border-primary/40 hover:text-primary transition-colors"
            }
          >
            {n}
          </Link>
        );
      })}
    </nav>
  );
}
