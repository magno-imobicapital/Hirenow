"use client";

import { useState } from "react";
import Modal from "@/components/modal";

type Profile = {
  fullName: string | null;
  about: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  salaryExpectation: number | string | null;
  resumeUrl: string | null;
};

type CandidateProfileButtonProps = {
  email: string;
  profile: Profile | null;
};

function formatSalary(value: number | string | null) {
  if (value == null) return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CandidateProfileButton({
  email,
  profile,
}: CandidateProfileButtonProps) {
  const [open, setOpen] = useState(false);
  const salary = formatSalary(profile?.salaryExpectation ?? null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] font-semibold text-primary hover:underline"
      >
        Ver perfil →
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={profile?.fullName || email}
      >
        <div className="flex flex-col gap-4 text-sm text-secondary">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail
            </span>
            <a
              href={`mailto:${email}`}
              className="text-secondary-dark hover:text-primary hover:underline"
            >
              {email}
            </a>
          </div>

          {profile?.about ? (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sobre
              </span>
              <p className="whitespace-pre-wrap text-secondary-dark">
                {profile.about}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profile?.mobilePhone ? (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Celular
                </span>
                <span className="text-secondary-dark">{profile.mobilePhone}</span>
              </div>
            ) : null}
            {profile?.landlinePhone ? (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Telefone fixo
                </span>
                <span className="text-secondary-dark">{profile.landlinePhone}</span>
              </div>
            ) : null}
            {salary ? (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pretensão salarial
                </span>
                <span className="text-secondary-dark">{salary}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            {profile?.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors"
              >
                Abrir currículo (PDF)
              </a>
            ) : (
              <span className="text-xs italic text-muted-foreground">
                Candidato sem currículo enviado.
              </span>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
