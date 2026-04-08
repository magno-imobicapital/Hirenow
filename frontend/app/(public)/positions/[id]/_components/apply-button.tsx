"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { applyToPositionAction } from "../_actions";

type ApplyButtonProps = {
  positionId: string;
};

type BlockReason = "no-profile" | "incomplete-profile" | "no-resume";

export default function ApplyButton({ positionId }: ApplyButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<BlockReason | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    setError(null);
    setBlocked(null);
    startTransition(async () => {
      const res = await applyToPositionAction(positionId);
      if (res && !res.ok) {
        setError(res.error.join(" "));
        if (
          res.reason === "no-profile" ||
          res.reason === "incomplete-profile" ||
          res.reason === "no-resume"
        ) {
          setBlocked(res.reason);
        }
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Candidatar-se"}
      </button>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 max-w-sm">
          <p>{error}</p>
          {blocked ? (
            <Link
              href="/profile"
              className="mt-2 inline-flex items-center gap-1 font-semibold text-red-800 hover:underline"
            >
              Ir para o meu perfil →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
