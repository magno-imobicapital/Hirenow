"use client";

import { useRef, useState, useTransition } from "react";
import { uploadResumeAction } from "../_actions";

type ResumeUploadProps = {
  resumeUrl: string | null;
};

export default function ResumeUpload({ resumeUrl }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await uploadResumeAction(formData);
      if (!res.ok) setError(res.error.join("\n"));
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-primary/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-secondary-dark">Currículo (PDF)</h3>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ver currículo atual
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">
              Nenhum currículo enviado.
            </p>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60">
          {pending ? "Enviando..." : resumeUrl ? "Substituir" : "Enviar PDF"}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={pending}
            onChange={onChange}
          />
        </label>
      </div>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
