type Statistic = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

type PageStatisticsProps = {
  statistics: Statistic[];
};

export default function PageStatistics({ statistics }: PageStatisticsProps) {
  return (
    <div className="max-w-[1500px] px-12 lg:px-16 mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statistics.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-background px-6 py-5"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {stat.label}
          </span>
          <p
            className={`mt-2 text-3xl font-extrabold ${
              stat.highlight ? "text-primary" : "text-secondary-dark"
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
