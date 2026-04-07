"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

const registerSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register, handleSubmit } = useForm<RegisterForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function onSubmit(data: RegisterForm) {
    const result = registerSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message));
      return;
    }

    const { email, password } = result.data;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    const { acessToken } = await response.json();
    console.log(acessToken);
    toast.success("Conta criada com sucesso!");
  }

  return (
    <div className="min-h-dvh flex bg-background">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap"
      />

      {/* ── Formulário ── */}
      <div
        className="w-full lg:w-[52%] flex items-center justify-center px-6 py-12 sm:px-12"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <img src="/images/logo.png" alt="HireMe" className="h-6 w-auto" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-[2.1rem] font-bold text-secondary-dark leading-tight tracking-tight mb-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Crie sua conta
            </h1>
            <p className="text-muted-foreground text-[0.95rem] leading-relaxed">
              Comece a conectar-se com as melhores oportunidades do mercado.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary mb-1.5"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-secondary outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  {...register("password")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 pr-10 text-secondary outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499L3.061 3.081" />
                      <path d="M13.875 18.825a10.744 10.744 0 0 1-11.813-6.476 1 1 0 0 1 0-.696A10.72 10.72 0 0 1 6.461 6.53" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar senha */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-secondary mb-1.5"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repita sua senha"
                  {...register("confirmPassword")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 pr-10 text-secondary outline-none transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-secondary-light/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors cursor-pointer"
                >
                  {showConfirm ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499L3.061 3.081" />
                      <path d="M13.875 18.825a10.744 10.744 0 0 1-11.813-6.476 1 1 0 0 1 0-.696A10.72 10.72 0 0 1 6.461 6.53" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] cursor-pointer"
            >
              Criar conta
            </button>
          </form>

          {/* Link login */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors underline decoration-primary/30 underline-offset-2 hover:decoration-primary/60"
            >
              Faça login
            </a>
          </p>
        </div>
      </div>

      {/* ── Painel decorativo ── */}
      <div
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-center justify-center"
        style={{
          background:
            "linear-gradient(145deg, #0296D8 0%, #0178AD 50%, #242E35 100%)",
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Formas geométricas */}
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full border-[40px] border-white/[0.07] animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 -left-16 -translate-y-1/2 w-72 h-72 rounded-full bg-primary-light/15 animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-[30%] right-[20%] w-20 h-20 rounded-full bg-white/10 animate-[pulse_6s_ease-in-out_infinite_1s]" />
          <div className="absolute top-0 right-[35%] w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute top-[20%] left-[25%] w-2 h-2 rounded-full bg-white/25" />
          <div className="absolute top-[65%] right-[30%] w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="absolute bottom-[25%] left-[40%] w-2.5 h-2.5 rounded-full bg-white/15" />
          <div
            className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="mb-10 flex justify-center">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-2xl bg-white/10 rotate-6 backdrop-blur-sm" />
              <div className="absolute inset-2 rounded-xl bg-white/10 -rotate-3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="8.5"
                    cy="7"
                    r="4"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M20 8V14M17 11H23"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2
            className="text-white text-2xl font-semibold mb-3 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Sua próxima oportunidade
            <br />
            começa aqui.
          </h2>
          <p className="text-white/60 text-[0.9rem] leading-relaxed">
            Milhares de empresas já encontraram os melhores talentos através da
            nossa plataforma.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["2.400+ empresas", "98% satisfação", "50k+ contratações"].map(
              (stat) => (
                <span
                  key={stat}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/70 tracking-wide"
                >
                  {stat}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
