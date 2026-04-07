const EMPLOYMENT_TYPES = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Estágio" },
  { value: "TEMPORARY", label: "Temporário" },
];

type PositionsFiltersProps = {
  search: string;
  employmentType: string;
  mine: boolean;
};

export default function PositionsFilters({
  search,
  employmentType,
  mine,
}: PositionsFiltersProps) {
  return (
    <form
      method="get"
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        name="search"
        defaultValue={search}
        placeholder="Buscar por título ou descrição..."
        className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-secondary outline-none transition-colors hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
      <select
        name="employmentType"
        defaultValue={employmentType}
        className="rounded-md border border-border bg-background px-4 py-2.5 text-sm text-secondary outline-none transition-colors hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:w-52"
      >
        <option value="">Todos os modelos</option>
        {EMPLOYMENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <label className="inline-flex items-center gap-2 px-3 text-sm text-secondary">
        <input
          type="checkbox"
          name="mine"
          value="true"
          defaultChecked={mine}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        Criadas por mim
      </label>
      <button
        type="submit"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
      >
        Filtrar
      </button>
    </form>
  );
}
