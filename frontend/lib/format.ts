type SalaryInput = {
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
};

export function formatSalary(p: SalaryInput) {
  if (p.salaryMin == null && p.salaryMax == null) return null;
  const currency = p.currency ?? "BRL";
  const fmt = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  if (p.salaryMin != null && p.salaryMax != null)
    return `${fmt(p.salaryMin)} - ${fmt(p.salaryMax)}`;
  if (p.salaryMin != null) return `A partir de ${fmt(p.salaryMin)}`;
  return `Até ${fmt(p.salaryMax!)}`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
