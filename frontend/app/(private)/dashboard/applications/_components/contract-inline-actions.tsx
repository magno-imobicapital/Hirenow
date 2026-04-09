"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/modal";
import {
  acceptContractAction,
  rejectContractAction,
} from "@/app/(public)/contract/[token]/_actions";

type ContractInlineActionsProps = {
  token: string;
  positionTitle: string;
};

export default function ContractInlineActions({
  token,
  positionTitle,
}: ContractInlineActionsProps) {
  const [done, setDone] = useState<"signed" | "withdrawn" | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onAccept() {
    startTransition(async () => {
      const res = await acceptContractAction(token);
      if (!res.ok) {
        res.error.forEach((m) => toast.error(m));
        return;
      }
      toast.success("Contrato assinado!");
      setDone("signed");
    });
  }

  function onReject() {
    startTransition(async () => {
      const res = await rejectContractAction(token);
      if (!res.ok) {
        res.error.forEach((m) => toast.error(m));
        return;
      }
      toast.success("Candidatura cancelada");
      setDone("withdrawn");
      setRejectOpen(false);
    });
  }

  if (done === "signed") {
    return (
      <span className="text-xs font-semibold text-green-700">
        Contrato assinado
      </span>
    );
  }

  if (done === "withdrawn") {
    return (
      <span className="text-xs font-semibold text-red-700">
        Desistiu
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAccept}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {pending ? "..." : "Aceitar contrato"}
        </button>
        <button
          type="button"
          onClick={() => setRejectOpen(true)}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          Recusar
        </button>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Recusar contrato"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">
            Tem certeza que deseja recusar o contrato para{" "}
            <strong className="text-secondary-dark">{positionTitle}</strong>?
          </p>
          <p className="rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setRejectOpen(false)}
              disabled={pending}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-secondary hover:bg-muted transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={pending}
              className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {pending ? "Recusando..." : "Sim, recusar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
