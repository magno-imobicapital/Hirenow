"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/modal";
import { withdrawApplicationAction } from "../_actions";

type WithdrawButtonProps = {
  applicationId: string;
  positionTitle: string;
};

export default function WithdrawButton({
  applicationId,
  positionTitle,
}: WithdrawButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmWithdraw() {
    setError(null);
    startTransition(async () => {
      const res = await withdrawApplicationAction(applicationId);
      if (!res.ok) {
        setError(res.error.join("\n"));
        return;
      }
      setOpen(false);
    });
  }

  function close() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors whitespace-nowrap"
      >
        Desistir
      </button>

      <Modal open={open} onClose={close} title="Desistir da candidatura">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">
            Tem certeza que deseja desistir da candidatura para{" "}
            <strong className="text-secondary-dark">{positionTitle}</strong>?
          </p>
          <p className="rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Esta ação não pode ser desfeita. Você não poderá se candidatar
            novamente para esta vaga.
          </p>

          {error ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
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
              type="button"
              onClick={confirmWithdraw}
              disabled={pending}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {pending ? "Desistindo..." : "Sim, desistir"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
