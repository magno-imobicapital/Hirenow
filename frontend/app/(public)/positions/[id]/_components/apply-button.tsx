"use client";

import { useState, useTransition } from "react";
import { applyToPositionAction } from "../_actions";

type ApplyButtonProps = {
  positionId: string;
};

export default function ApplyButton({ positionId }: ApplyButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    setError(null);
    startTransition(async () => {
      const res = await applyToPositionAction(positionId);
      if (res && !res.ok) setError(res.error.join(" "));
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Candidatar-se"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
