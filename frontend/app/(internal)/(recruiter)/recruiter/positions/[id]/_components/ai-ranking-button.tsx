"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/modal";

type RankedCandidate = {
  applicationId: string;
  rank: number;
  reason: string;
  candidateName: string;
  candidateEmail: string;
};

type AiRankingButtonProps = {
  positionId: string;
};

const RANK_STYLES = [
  "border-yellow-400 bg-yellow-50",
  "border-slate-300 bg-slate-50",
  "border-amber-600 bg-amber-50",
];

const RANK_LABELS = ["1º", "2º", "3º"];

export default function AiRankingButton({ positionId }: AiRankingButtonProps) {
  const [open, setOpen] = useState(false);
  const [ranking, setRanking] = useState<RankedCandidate[]>([]);
  const [pending, startTransition] = useTransition();

  function onOpen() {
    setOpen(true);
    setRanking([]);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/ranking/${positionId}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.error || "Erro ao gerar ranking");
          return;
        }
        setRanking(data);
      } catch {
        toast.error("Erro ao conectar com IA");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-2 rounded-md bg-secondary-dark px-4 py-2 text-xs font-semibold text-white hover:bg-secondary transition-colors"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a5 5 0 0 1 5 5c0 2-1.5 3.5-3 4.5V13H10v-1.5C8.5 10.5 7 9 7 7a5 5 0 0 1 5-5z" />
          <path d="M10 13v4h4v-4" />
          <path d="M9 21h6" />
          <path d="M10 17h4" />
        </svg>
        Top 3 candidatos (IA)
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Top 3 candidatos — Análise IA"
      >
        {pending ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Analisando candidatos...
            </p>
          </div>
        ) : ranking.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Não foi possível gerar o ranking. Verifique se há candidatos e se o
            Ollama está rodando.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {ranking.map((r, i) => (
              <article
                key={r.applicationId}
                className={`rounded-xl border-2 p-5 ${RANK_STYLES[i] ?? "border-border bg-background"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-dark text-xs font-bold text-white">
                    {RANK_LABELS[i] ?? `${i + 1}º`}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-secondary-dark">
                      {r.candidateName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.candidateEmail}
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-secondary">
                  {r.reason}
                </p>
              </article>
            ))}
            <p className="text-[10px] text-muted-foreground italic text-center">
              Ranking gerado por IA (Ollama). Use como referência, não como
              decisão final.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
