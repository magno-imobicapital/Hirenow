"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Modal from "@/components/modal";
import { createInternalUserAction } from "../_actions";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "RECRUITER"]),
});

type FormValues = z.infer<typeof schema>;

const resolver: Resolver<FormValues> = async (values) => {
  const result = schema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    if (!errors[key])
      errors[key] = { type: "validation", message: issue.message };
  }
  return { values: {}, errors: errors as never };
};

const inputBase =
  "w-full rounded-md border bg-background px-3 py-2 text-sm text-secondary-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";
const inputOk = `${inputBase} border-border`;
const inputErr = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-200`;
const labelClass = "flex flex-col gap-1.5 text-xs font-semibold text-secondary";

const Required = () => <span className="text-red-500">*</span>;

export default function CreateUserButton() {
  const [open, setOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    defaultValues: { email: "", password: "", role: "RECRUITER" },
  });

  function onSubmit(values: FormValues) {
    setServerErrors([]);
    startTransition(async () => {
      const res = await createInternalUserAction(values);
      if (!res.ok) {
        setServerErrors(res.error);
        return;
      }
      toast.success("Usuário criado");
      setOpen(false);
      reset();
    });
  }

  function close() {
    if (pending) return;
    setOpen(false);
    setServerErrors([]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
      >
        + Novo usuário
      </button>

      <Modal open={open} onClose={close} title="Criar usuário interno">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <label className={labelClass}>
            <span>E-MAIL <Required /></span>
            <input
              type="email"
              {...register("email")}
              className={errors.email ? inputErr : inputOk}
            />
            {errors.email && (
              <span className="text-[11px] font-normal text-red-600">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className={labelClass}>
            <span>SENHA <Required /></span>
            <input
              type="password"
              {...register("password")}
              className={errors.password ? inputErr : inputOk}
            />
            {errors.password && (
              <span className="text-[11px] font-normal text-red-600">
                {errors.password.message}
              </span>
            )}
          </label>

          <label className={labelClass}>
            <span>ROLE <Required /></span>
            <select {...register("role")} className={inputOk}>
              <option value="RECRUITER">Recrutador</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

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
              onClick={close}
              disabled={pending}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-secondary hover:bg-muted transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {pending ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
