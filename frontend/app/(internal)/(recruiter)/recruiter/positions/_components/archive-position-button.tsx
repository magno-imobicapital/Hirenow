"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { togglePositionActiveAction } from "../_actions";

type TogglePositionActiveButtonProps = {
  positionId: string;
  isActive: boolean;
};

export default function TogglePositionActiveButton({
  positionId,
  isActive,
}: TogglePositionActiveButtonProps) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const res = await togglePositionActiveAction(positionId, !isActive);
      if (!res.ok) {
        res.error.forEach((m) => toast.error(m));
        return;
      }
      toast.success(isActive ? "Vaga desativada" : "Vaga ativada");
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={isActive ? "Desativar vaga" : "Ativar vaga"}
      onClick={onClick}
      disabled={pending}
      className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors disabled:opacity-60 ${
        isActive
          ? "bg-primary border-primary"
          : "bg-muted border-border"
      }`}
    >
      <span
        className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow transition-transform ${
          isActive ? "translate-x-3.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
