"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";

type Profile = {
  fullName: string | null;
  resumeUrl: string | null;
};

export async function applyToPositionAction(positionId: string) {
  const profileRes = await api<Profile>("/profile");

  if (!profileRes.ok || !profileRes.data) {
    return {
      ok: false as const,
      reason: "no-profile" as const,
      error: [
        "Você precisa criar seu perfil e enviar um currículo antes de se candidatar.",
      ],
    };
  }

  if (!profileRes.data.fullName?.trim()) {
    return {
      ok: false as const,
      reason: "incomplete-profile" as const,
      error: ["Complete seu perfil (nome completo) antes de se candidatar."],
    };
  }

  if (!profileRes.data.resumeUrl) {
    return {
      ok: false as const,
      reason: "no-resume" as const,
      error: ["Envie seu currículo em PDF antes de se candidatar."],
    };
  }

  const res = await api(`/positions/${positionId}/apply`, { method: "POST" });

  if (!res.ok) {
    return { ok: false as const, reason: "api-error" as const, error: res.error };
  }

  redirect("/dashboard/applications");
}
