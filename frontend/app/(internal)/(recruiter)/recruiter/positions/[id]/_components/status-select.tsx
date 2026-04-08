"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { updateApplicationStatusAction } from "../_actions";

const STATUSES = [
  { value: "PENDING", label: "Pendente" },
  { value: "REVIEWING", label: "Em análise" },
  { value: "INTERVIEW", label: "Entrevista" },
  { value: "TECHNICAL_INTERVIEW", label: "Entrevista técnica" },
  { value: "HIRED", label: "Contratado" },
  { value: "REJECTED", label: "Reprovado" },
  { value: "WITHDRAWN", label: "Desistente" },
];

const TERMINAL = new Set(["WITHDRAWN", "HIRED", "REJECTED"]);

type StatusSelectProps = {
  applicationId: string;
  positionId: string;
  currentStatus: string;
};

export default function StatusSelect({
  applicationId,
  positionId,
  currentStatus,
}: StatusSelectProps) {
  const [pending, startTransition] = useTransition();

  if (TERMINAL.has(currentStatus)) {
    return (
      <p className="text-[11px] italic text-muted-foreground">
        Status final — não pode ser alterado.
      </p>
    );
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    if (next === currentStatus) return;
    startTransition(async () => {
      const res = await updateApplicationStatusAction(
        applicationId,
        next,
        positionId,
      );
      if (!res.ok) {
        res.error.forEach((m) => toast.error(m));
        return;
      }
      toast.success("Status atualizado");
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={onChange}
      disabled={pending}
      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-[11px] font-semibold text-secondary-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          Mover para: {s.label}
        </option>
      ))}
    </select>
  );
}
