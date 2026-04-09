"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Modal from "@/components/modal";
import { acceptContractAction, rejectContractAction } from "../_actions";

type ContractActionsProps = {
  token: string;
  positionTitle: string;
};

export default function ContractActions({
  token,
  positionTitle,
}: ContractActionsProps) {
  const [done, setDone] = useState<"signed" | "withdrawn" | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const autoRan = useRef(false);

  useEffect(() => {
    if (autoRan.current || done) return;
    const action = searchParams.get("action");
    if (action === "accept") {
      autoRan.current = true;
      onAccept();
    } else if (action === "reject") {
      autoRan.current = true;
      setRejectOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onAccept() {
    setError(null);
    startTransition(async () => {
      const res = await acceptContractAction(token);
      if (!res.ok) {
        setError(res.error.join(" "));
        toast.error(res.error.join(" "));
        return;
      }
      toast.success("Contrato assinado com sucesso!");
      setDone("signed");
    });
  }

  function onReject() {
    setError(null);
    startTransition(async () => {
      const res = await rejectContractAction(token);
      if (!res.ok) {
        setError(res.error.join(" "));
        toast.error(res.error.join(" "));
        return;
      }
      toast.success("Candidatura cancelada");
      setDone("withdrawn");
      setRejectOpen(false);
    });
  }

  if (done === "signed") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-xl font-bold text-green-800">
          Contrato assinado!
        </h2>
        <p className="mt-2 text-sm text-green-700">
          Parabéns! Seu contrato para a vaga de {positionTitle} foi registrado.
        </p>
      </div>
    );
  }

  if (done === "withdrawn") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-bold text-red-800">
          Candidatura cancelada
        </h2>
        <p className="mt-2 text-sm text-red-700">
          Você desistiu da vaga de {positionTitle}. Obrigado pelo interesse.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onAccept}
          disabled={pending}
          className="flex-1 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-60"
        >
          {pending ? "Processando..." : "Aceitar contrato"}
        </button>
        <button
          type="button"
          onClick={() => setRejectOpen(true)}
          disabled={pending}
          className="flex-1 rounded-xl border border-red-200 bg-white px-6 py-4 text-sm font-semibold text-red-700 hover:bg-red-50 transition-all disabled:opacity-60"
        >
          Desistir da vaga
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Desistir da vaga"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-secondary">
            Tem certeza que deseja desistir da vaga de{" "}
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
              {pending ? "Desistindo..." : "Sim, desistir"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
