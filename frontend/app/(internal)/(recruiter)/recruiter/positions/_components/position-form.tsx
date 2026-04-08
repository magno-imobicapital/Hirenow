"use client";

import { useTransition, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

const EMPLOYMENT_TYPES = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Estágio" },
  { value: "TEMPORARY", label: "Temporário" },
] as const;

const CURRENCIES = ["BRL", "USD", "EUR"] as const;

const baseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  employmentType: z.enum(["CLT", "PJ", "FREELANCE", "INTERNSHIP", "TEMPORARY"]),
  location: z.string().min(1, "Localização é obrigatória"),
  salaryMin: z.coerce.number().min(0, "Mínimo 0"),
  salaryMax: z.coerce.number().min(0, "Mínimo 0"),
  currency: z.enum(CURRENCIES),
  isActive: z.boolean(),
});

const schema = baseSchema.refine((d) => d.salaryMax >= d.salaryMin, {
  path: ["salaryMax"],
  message: "Salário máximo deve ser maior ou igual ao mínimo",
});

export type PositionFormValues = z.infer<typeof schema>;

const resolver: Resolver<PositionFormValues> = async (values) => {
  const result = schema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    if (!errors[key]) errors[key] = { type: "validation", message: issue.message };
  }
  return { values: {}, errors: errors as never };
};

const inputBase =
  "w-full rounded-md border bg-background px-3 py-2 text-sm text-secondary-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";
const inputOk = `${inputBase} border-border`;
const inputErr = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-200`;
const labelClass = "flex flex-col gap-1.5 text-xs font-semibold text-secondary";

const Required = () => <span className="text-red-500">*</span>;

type PositionFormProps = {
  defaultValues?: Partial<PositionFormValues>;
  submitLabel: string;
  showActiveToggle?: boolean;
  onSubmit: (
    values: PositionFormValues,
  ) => Promise<{ ok: true } | { ok: false; error: string[] }>;
  onCancel: () => void;
};

export default function PositionForm({
  defaultValues,
  submitLabel,
  showActiveToggle = true,
  onSubmit,
  onCancel,
}: PositionFormProps) {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver,
    defaultValues: {
      title: "",
      description: "",
      employmentType: "CLT",
      location: "",
      salaryMin: 0,
      salaryMax: 0,
      currency: "BRL",
      isActive: true,
      ...defaultValues,
    },
  });

  function submit(values: PositionFormValues) {
    setServerErrors([]);
    startTransition(async () => {
      const res = await onSubmit(values);
      if (!res.ok) setServerErrors(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
      <label className={labelClass}>
        <span>TÍTULO <Required /></span>
        <input
          type="text"
          {...register("title")}
          className={errors.title ? inputErr : inputOk}
        />
        {errors.title && (
          <span className="text-[11px] font-normal text-red-600">{errors.title.message}</span>
        )}
      </label>

      <label className={labelClass}>
        <span>DESCRIÇÃO <Required /></span>
        <textarea
          rows={4}
          {...register("description")}
          className={errors.description ? inputErr : inputOk}
        />
        {errors.description && (
          <span className="text-[11px] font-normal text-red-600">{errors.description.message}</span>
        )}
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          <span>TIPO DE CONTRATAÇÃO <Required /></span>
          <select
            {...register("employmentType")}
            className={errors.employmentType ? inputErr : inputOk}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          <span>LOCALIZAÇÃO <Required /></span>
          <input
            type="text"
            {...register("location")}
            className={errors.location ? inputErr : inputOk}
          />
          {errors.location && (
            <span className="text-[11px] font-normal text-red-600">{errors.location.message}</span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          <span>SALÁRIO MIN <Required /></span>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("salaryMin")}
            className={errors.salaryMin ? inputErr : inputOk}
          />
          {errors.salaryMin && (
            <span className="text-[11px] font-normal text-red-600">{errors.salaryMin.message}</span>
          )}
        </label>
        <label className={labelClass}>
          <span>SALÁRIO MAX <Required /></span>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("salaryMax")}
            className={errors.salaryMax ? inputErr : inputOk}
          />
          {errors.salaryMax && (
            <span className="text-[11px] font-normal text-red-600">{errors.salaryMax.message}</span>
          )}
        </label>
        <label className={labelClass}>
          <span>MOEDA <Required /></span>
          <select {...register("currency")} className={inputOk}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {showActiveToggle ? (
        <label className="inline-flex items-center gap-2 text-sm text-secondary">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Publicar vaga imediatamente
        </label>
      ) : null}

      {serverErrors.length > 0 ? (
        <ul className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverErrors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-secondary hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
