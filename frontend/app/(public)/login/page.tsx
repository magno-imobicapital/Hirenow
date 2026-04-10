"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { loginAction } from "./actions";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? undefined;

  async function onSubmit(data: LoginForm) {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => toast.error(issue.message));
      return;
    }

    const { email, password } = result.data;

    const res = await loginAction(email, password, from);
    if (res?.error) {
      res.error.forEach((msg) => toast.error(msg));
      return;
    }
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
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground text-[0.95rem] leading-relaxed">
              Acesse sua conta para continuar.
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
                  autoComplete="current-password"
                  placeholder="Sua senha"
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

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Link registro */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <a
              href="/register"
              className="font-medium text-primary hover:text-primary-dark transition-colors underline decoration-primary/30 underline-offset-2 hover:decoration-primary/60"
            >
              Cadastre-se
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
                    d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 17L15 12L10 7"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12H3"
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
            Continue sua jornada
            <br />
            de oportunidades.
          </h2>
          <p className="text-white/60 text-[0.9rem] leading-relaxed">
            Acesse seu painel para acompanhar candidaturas, entrevistas e novas
            vagas.
          </p>
        </div>
      </div>
    </div>
  );
}
