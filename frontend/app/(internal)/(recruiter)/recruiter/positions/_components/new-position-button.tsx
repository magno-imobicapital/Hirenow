"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/modal";
import { createPositionAction } from "../_actions";
import PositionForm from "./position-form";

export default function NewPositionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
      >
        + Nova vaga
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova vaga">
        <PositionForm
          submitLabel="Criar vaga"
          onSubmit={async (values) => {
            const res = await createPositionAction(values);
            if (res.ok) {
              toast.success("Vaga criada com sucesso");
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
