"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import Modal from "@/components/modal";
import { scheduleInterviewAction } from "../_actions";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  scheduledAt: z.string().min(1, "Data e hora são obrigatórias"),
  meetingUrl: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("").transform(() => undefined)),
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

type ScheduleInterviewButtonProps = {
  applicationId: string;
  positionId: string;
  candidateName: string;
};

export default function ScheduleInterviewButton({
  applicationId,
  positionId,
  candidateName,
}: ScheduleInterviewButtonProps) {
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
    defaultValues: { title: "", scheduledAt: "", meetingUrl: "" },
  });

  function onSubmit(values: FormValues) {
    setServerErrors([]);
    startTransition(async () => {
      const res = await scheduleInterviewAction(applicationId, positionId, {
        title: values.title,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        meetingUrl: values.meetingUrl || undefined,
      });
      if (!res.ok) {
        setServerErrors(res.error);
        return;
      }
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
        className="text-[11px] font-semibold text-primary hover:underline"
      >
        + Agendar entrevista
      </button>

      <Modal
        open={open}
        onClose={close}
        title={`Agendar entrevista — ${candidateName}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <label className={labelClass}>
            <span>TÍTULO <Required /></span>
            <input
              type="text"
              placeholder="Ex: Entrevista cultural"
              {...register("title")}
              className={errors.title ? inputErr : inputOk}
            />
            {errors.title && (
              <span className="text-[11px] font-normal text-red-600">{errors.title.message}</span>
            )}
          </label>

          <label className={labelClass}>
            <span>DATA E HORA <Required /></span>
            <input
              type="datetime-local"
              {...register("scheduledAt")}
              className={errors.scheduledAt ? inputErr : inputOk}
            />
            {errors.scheduledAt && (
              <span className="text-[11px] font-normal text-red-600">{errors.scheduledAt.message}</span>
            )}
          </label>

          <label className={labelClass}>
            URL DA REUNIÃO
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              {...register("meetingUrl")}
              className={errors.meetingUrl ? inputErr : inputOk}
            />
            {errors.meetingUrl && (
              <span className="text-[11px] font-normal text-red-600">{errors.meetingUrl.message}</span>
            )}
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
              {pending ? "Agendando..." : "Agendar"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
