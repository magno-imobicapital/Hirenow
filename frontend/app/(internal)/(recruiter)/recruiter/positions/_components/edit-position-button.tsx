"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/modal";
import { updatePositionAction } from "../_actions";
import PositionForm from "./position-form";

type EditPositionButtonProps = {
  position: {
    id: string;
    title: string;
    description: string;
    employmentType: string;
    location: string;
    salaryMin: number | string | null;
    salaryMax: number | string | null;
    currency: string | null;
    isActive: boolean;
  };
};

export default function EditPositionButton({ position }: EditPositionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Editar vaga"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary/15 text-secondary-dark hover:bg-secondary/25 transition-colors"
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
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Editar vaga">
        <PositionForm
          submitLabel="Salvar alterações"
          showActiveToggle={false}
          defaultValues={{
            title: position.title,
            description: position.description,
            employmentType: position.employmentType as
              | "CLT"
              | "PJ"
              | "FREELANCE"
              | "INTERNSHIP"
              | "TEMPORARY",
            location: position.location,
            salaryMin: Number(position.salaryMin ?? 0),
            salaryMax: Number(position.salaryMax ?? 0),
            currency: (position.currency ?? "BRL") as "BRL" | "USD" | "EUR",
            isActive: position.isActive,
          }}
          onSubmit={async (values) => {
            const { isActive: _ignored, ...rest } = values;
            void _ignored;
            const res = await updatePositionAction(position.id, rest);
            if (res.ok) {
              toast.success("Vaga atualizada");
              setOpen(false);
            }
            return res;
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
