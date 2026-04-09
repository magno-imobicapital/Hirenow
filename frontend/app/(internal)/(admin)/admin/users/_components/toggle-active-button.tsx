"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { activateUserAction, deactivateUserAction } from "../_actions";

type ToggleActiveButtonProps = {
  userId: string;
  isActive: boolean;
};

export default function ToggleActiveButton({
  userId,
  isActive,
}: ToggleActiveButtonProps) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const action = isActive ? deactivateUserAction : activateUserAction;
      const res = await action(userId);
      if (!res.ok) {
        res.error.forEach((m) => toast.error(m));
        return;
      }
      toast.success(isActive ? "Usuário desativado" : "Usuário ativado");
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={isActive ? "Desativar usuário" : "Ativar usuário"}
      onClick={onClick}
      disabled={pending}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors disabled:opacity-60 ${
        isActive ? "bg-primary border-primary" : "bg-muted border-border"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          isActive ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
