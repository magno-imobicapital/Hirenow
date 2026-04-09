"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { downloadPositionsXlsxAction } from "../_actions";

export default function ExportButton() {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const res = await downloadPositionsXlsxAction();
      if (!res.ok) {
        res.error.forEach((m) => toast.error(m));
        return;
      }
      const bytes = Uint8Array.from(atob(res.base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vagas-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Relatório baixado");
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
    >
      {pending ? "Gerando..." : "Exportar XLSX"}
    </button>
  );
}
