"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { saveProfileAction } from "../_actions";

const schema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  birthDate: z.string().optional().or(z.literal("")),
  about: z.string().optional().or(z.literal("")),
  mobilePhone: z.string().optional().or(z.literal("")),
  landlinePhone: z.string().optional().or(z.literal("")),
  salaryExpectation: z
    .union([z.coerce.number().min(0), z.literal("").transform(() => undefined)])
    .optional(),
});

type FormValues = z.infer<typeof schema>;

const resolver: Resolver<FormValues> = async (values) => {
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

type ProfileFormProps = {
  defaultValues?: Partial<FormValues>;
  exists: boolean;
};

export default function ProfileForm({ defaultValues, exists }: ProfileFormProps) {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      fullName: "",
      birthDate: "",
      about: "",
      mobilePhone: "",
      landlinePhone: "",
      salaryExpectation: undefined,
      ...defaultValues,
    },
  });

  function onSubmit(values: FormValues) {
    setServerErrors([]);
    setSuccess(false);
    startTransition(async () => {
      const payload = {
        fullName: values.fullName,
        birthDate: values.birthDate || undefined,
        about: values.about || undefined,
        mobilePhone: values.mobilePhone || undefined,
        landlinePhone: values.landlinePhone || undefined,
        salaryExpectation:
          typeof values.salaryExpectation === "number"
            ? values.salaryExpectation
            : undefined,
      };
      const res = await saveProfileAction(payload, exists);
      if (!res.ok) {
        setServerErrors(res.error);
        res.error.forEach((m) => toast.error(m));
        return;
      }
      setSuccess(true);
      toast.success("Perfil salvo");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <label className={labelClass}>
        <span>NOME COMPLETO <Required /></span>
        <input
          type="text"
          {...register("fullName")}
          className={errors.fullName ? inputErr : inputOk}
        />
        {errors.fullName && (
          <span className="text-[11px] font-normal text-red-600">
            {errors.fullName.message}
          </span>
        )}
      </label>

      <label className={labelClass}>
        SOBRE
        <textarea rows={4} {...register("about")} className={inputOk} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          DATA DE NASCIMENTO
          <input type="date" {...register("birthDate")} className={inputOk} />
        </label>
        <label className={labelClass}>
          PRETENSÃO SALARIAL (BRL)
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("salaryExpectation")}
            className={inputOk}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          TELEFONE CELULAR
          <input
            type="tel"
            {...register("mobilePhone")}
            className={inputOk}
          />
        </label>
        <label className={labelClass}>
          TELEFONE FIXO
          <input
            type="tel"
            {...register("landlinePhone")}
            className={inputOk}
          />
        </label>
      </div>

      {serverErrors.length > 0 ? (
        <ul className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverErrors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}

      {success ? (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          Perfil salvo com sucesso.
        </p>
      ) : null}

      <div className="flex justify-end border-t border-border pt-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {pending ? "Salvando..." : exists ? "Salvar alterações" : "Criar perfil"}
        </button>
      </div>
    </form>
  );
}
